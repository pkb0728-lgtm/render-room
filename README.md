# Render Room

Render Room is an AI product-photo studio built with Next.js. Upload a product image, choose a visual direction, and generate a polished commercial product shot with either GPT Image or Gemini Image.

## Features

- Product image upload with PNG, JPEG, and WEBP validation
- Optional mood reference image for lighting and color direction
- AI provider switcher: GPT Image or Gemini Image
- Studio-style options for mood, lighting, background, lens, aspect ratio, and quality
- Before / after preview
- Prompt preview for transparency and iteration
- One-click result download

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- OpenAI Images API
- Google Gemini Image API

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env.local
```

Fill in your API keys in `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_IMAGE_MODEL=gpt-image-2

GEMINI_API_KEY=your_gemini_api_key
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes, for GPT Image | OpenAI API key used when GPT Image is selected |
| `OPENAI_IMAGE_MODEL` | No | Defaults to `gpt-image-2` |
| `GEMINI_API_KEY` | Yes, for Gemini Image | Gemini API key used when Gemini Image is selected |
| `GEMINI_IMAGE_MODEL` | No | Defaults to `gemini-3.1-flash-image-preview` |

## Deployment

This project uses a Next.js API route, so deploy it to a platform that supports server-side routes, such as Vercel. Add the same environment variables in the deployment dashboard before testing image generation.

## Portfolio Notes

Render Room demonstrates a practical multimodal AI workflow: image upload, prompt construction, provider selection, server-side API orchestration, and generated asset delivery. It is designed as a small but complete product workflow rather than a static demo.
