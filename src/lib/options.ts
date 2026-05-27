import type { AspectRatio, RenderOptions } from '@/types/render';

export const imageProviders = ['openai', 'gemini'] as const;

export const moodTemplates = [
  'minimal_white',
  'dark_premium',
  'natural_window',
  'korean_sns',
  'luxury_editorial',
] as const;

export const lightings = ['softbox', 'rim_light', 'natural_window_light', 'spotlight'] as const;

export const backgrounds = [
  'white_seamless',
  'dark_gray',
  'beige_paper',
  'marble',
  'wooden_table',
] as const;

export const lenses = ['35mm', '50mm', '85mm', '100mm_macro'] as const;

export const aspectRatios = ['square', 'portrait', 'landscape'] as const;

export const qualities = ['low', 'medium', 'high'] as const;

export function mapAspectToSize(aspect: AspectRatio): string {
  switch (aspect) {
    case 'square':
      return '1024x1024';
    case 'portrait':
      return '1024x1536';
    case 'landscape':
      return '1536x1024';
    default:
      return '1024x1024';
  }
}

export const defaultOptions: RenderOptions = {
  provider: 'openai',
  moodTemplate: 'minimal_white',
  lighting: 'softbox',
  background: 'white_seamless',
  lens: '50mm',
  aspectRatio: 'square',
  quality: 'high',
};
