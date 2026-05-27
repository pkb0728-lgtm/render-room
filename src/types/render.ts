export type MoodTemplate =
  | 'minimal_white'
  | 'dark_premium'
  | 'natural_window'
  | 'korean_sns'
  | 'luxury_editorial';

export type Lighting = 'softbox' | 'rim_light' | 'natural_window_light' | 'spotlight';

export type Background =
  | 'white_seamless'
  | 'dark_gray'
  | 'beige_paper'
  | 'marble'
  | 'wooden_table';

export type Lens = '35mm' | '50mm' | '85mm' | '100mm_macro';

export type AspectRatio = 'square' | 'portrait' | 'landscape';

export type Quality = 'low' | 'medium' | 'high';

export type ImageProvider = 'openai' | 'gemini';

export type RenderOptions = {
  provider: ImageProvider;
  moodTemplate: MoodTemplate;
  lighting: Lighting;
  background: Background;
  lens: Lens;
  aspectRatio: AspectRatio;
  quality: Quality;
};
