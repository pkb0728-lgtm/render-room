import type { RenderOptions } from '@/types/render';

export function buildRenderPrompt(options: RenderOptions) {
  const parts: string[] = [];

  parts.push('Convert the uploaded product photo into a premium commercial studio product shot.');

  parts.push('Keep the original product\'s shape, silhouette, proportions, color, material, logo placement, and main details exactly as they are. Do not redesign the product.');

  parts.push('Do NOT add people, hands, unnecessary props, random text, or new logos. The product must be the clear, sharp main subject.');

  parts.push('Produce realistic shadows and natural reflections. Maintain accurate product proportions and avoid any distortion. Background must be clean and uncluttered.');

  parts.push('Style the image to look like a high-end commercial photograph suitable for Korean SNS/product detail pages: clean, premium, and advertising-ready.');

  // Apply option-driven tonal hints
  parts.push(`Lighting: ${humanizeLighting(options.lighting)}.`);
  parts.push(`Background: ${humanizeBackground(options.background)}.`);
  parts.push(`Lens: ${options.lens} look (shallow depth of field if applicable).`);
  parts.push(`Mood template: ${humanizeMood(options.moodTemplate)}.`);
  parts.push(`Aspect ratio: ${options.aspectRatio}. Output quality preference: ${options.quality}.`);

  parts.push('If a separate mood reference image is provided, only reference its lighting, color grading, and overall mood — do not copy any branded elements, characters, or product forms from the reference.');

  parts.push('Final output: realistic, high-resolution, retouched product photo with natural studio lighting, accurate color, and crisp details.');

  return parts.join('\n');
}

function humanizeLighting(l: string) {
  switch (l) {
    case 'softbox':
      return 'soft, even studio softbox lighting with gentle falloff';
    case 'rim_light':
      return 'rim/back lighting to separate product from background';
    case 'natural_window_light':
      return 'soft natural window light with directional highlights';
    case 'spotlight':
      return 'focused spotlight for contrast and drama';
    default:
      return l;
  }
}

function humanizeBackground(b: string) {
  switch (b) {
    case 'white_seamless':
      return 'clean white seamless background';
    case 'dark_gray':
      return 'dark gray seamless background with subtle texture';
    case 'beige_paper':
      return 'warm beige paper backdrop';
    case 'marble':
      return 'clean marble surface/backdrop with subtle reflection';
    case 'wooden_table':
      return 'wooden tabletop with tasteful grain and slight reflection';
    default:
      return b;
  }
}

function humanizeMood(m: string) {
  switch (m) {
    case 'minimal_white':
      return 'minimal white premium studio mood with clean composition';
    case 'dark_premium':
      return 'dark premium mood with rich contrast and luxury feel';
    case 'natural_window':
      return 'natural window-lit mood with soft highlights and warm tones';
    case 'korean_sns':
      return 'Korean SNS style mood with polished, modern aesthetic';
    case 'luxury_editorial':
      return 'luxury editorial mood with refined color grading and premium polish';
    default:
      return m;
  }
}
