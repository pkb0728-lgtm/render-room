import { NextResponse } from 'next/server';
import { OpenAI, toFile } from 'openai';
import { buildRenderPrompt } from '../../../lib/renderPrompt';
import { mapAspectToSize } from '../../../lib/options';
import type { RenderOptions } from '../../../types/render';

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];

type GeminiRequestPart =
  | { text: string }
  | {
      inline_data: {
        mime_type: string;
        data: string;
      };
    };

type GeminiResponsePart = {
  text?: string;
  inlineData?: { data?: string };
  inline_data?: { data?: string };
};

type GeminiResponse = {
  error?: { message?: string };
  candidates?: Array<{
    content?: {
      parts?: GeminiResponsePart[];
    };
  }>;
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const product = form.get('productImage') as File | null;
    const mood = form.get('moodReferenceImage') as File | null;
    const optionsRaw = form.get('options')?.toString() ?? '{}';

    if (!product) {
      return NextResponse.json({ error: 'Please upload a product image.' }, { status: 400 });
    }

    const validationError = validateImage(product, 'Product image') || (mood ? validateImage(mood, 'Mood reference image') : null);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const options = parseOptions(optionsRaw);
    const productBuf = Buffer.from(await product.arrayBuffer());
    const moodBuf = mood ? Buffer.from(await mood.arrayBuffer()) : null;
    const prompt = buildRenderPrompt(options);

    const image =
      options.provider === 'gemini'
        ? await generateWithGemini({ product, productBuf, mood, moodBuf, prompt })
        : await generateWithOpenAI({ product, productBuf, mood, moodBuf, prompt, options });

    return NextResponse.json({ image });
  } catch (error: unknown) {
    return NextResponse.json({ error: `Server error: ${getErrorMessage(error)}` }, { status: 500 });
  }
}

function validateImage(file: File, label: string) {
  if (!allowedImageTypes.includes(file.type)) {
    return `${label} must be a PNG, JPEG, or WEBP file.`;
  }

  if (file.size > 10 * 1024 * 1024) {
    return `${label} must be 10MB or smaller.`;
  }

  return null;
}

function parseOptions(optionsRaw: string): RenderOptions {
  try {
    const parsed = JSON.parse(optionsRaw) as Partial<RenderOptions>;
    return {
      provider: parsed.provider ?? 'openai',
      moodTemplate: parsed.moodTemplate ?? 'minimal_white',
      lighting: parsed.lighting ?? 'softbox',
      background: parsed.background ?? 'white_seamless',
      lens: parsed.lens ?? '50mm',
      aspectRatio: parsed.aspectRatio ?? 'square',
      quality: parsed.quality ?? 'high',
    } as RenderOptions;
  } catch {
    return {
      provider: 'openai',
      moodTemplate: 'minimal_white',
      lighting: 'softbox',
      background: 'white_seamless',
      lens: '50mm',
      aspectRatio: 'square',
      quality: 'high',
    };
  }
}

async function generateWithOpenAI({
  product,
  productBuf,
  mood,
  moodBuf,
  prompt,
  options,
}: {
  product: File;
  productBuf: Buffer;
  mood: File | null;
  moodBuf: Buffer | null;
  prompt: string;
  options: RenderOptions;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!isConfiguredKey(apiKey)) {
    throw new Error('OPENAI_API_KEY is not configured in .env.local.');
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-2';
  const size = mapAspectToSize(options.aspectRatio);
  const imageFiles = [await toFile(productBuf, product.name || 'product.png', { type: product.type })];

  if (mood && moodBuf) {
    imageFiles.push(await toFile(moodBuf, mood.name || 'mood.png', { type: mood.type }));
  }

  const res = await client.images.edit({
    model,
    image: imageFiles,
    prompt: mood
      ? `${prompt}\nUse the second image as a reference for lighting, color, and mood only.`
      : prompt,
    size,
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('OpenAI did not return image data.');
  }

  return b64;
}

async function generateWithGemini({
  product,
  productBuf,
  mood,
  moodBuf,
  prompt,
}: {
  product: File;
  productBuf: Buffer;
  mood: File | null;
  moodBuf: Buffer | null;
  prompt: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!isConfiguredKey(apiKey)) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local.');
  }

  const model = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3.1-flash-image-preview';
  const parts: GeminiRequestPart[] = [
    {
      text: mood
        ? `${prompt}\nUse the second image as a reference for lighting, color, and mood only.`
        : prompt,
    },
    {
      inline_data: {
        mime_type: product.type,
        data: productBuf.toString('base64'),
      },
    },
  ];

  if (mood && moodBuf) {
    parts.push({
      inline_data: {
        mime_type: mood.type,
        data: moodBuf.toString('base64'),
      },
    });
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
      },
    }),
  });

  const data = (await res.json()) as GeminiResponse;
  if (!res.ok) {
    throw new Error(data.error?.message || 'Gemini image generation request failed.');
  }

  const responseParts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = responseParts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const b64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data;
  if (!b64) {
    const text = responseParts.map((part) => part.text).filter(Boolean).join(' ');
    throw new Error(text || 'Gemini did not return image data.');
  }

  return b64;
}

function isConfiguredKey(value: string | undefined): value is string {
  return Boolean(value && !value.includes('여기에') && !value.includes('?'));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
