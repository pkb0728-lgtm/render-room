"use client";

import { aspectRatios, backgrounds, imageProviders, lenses, lightings, moodTemplates, qualities } from '../lib/options';
import type { RenderOptions } from '@/types/render';

type Props = {
  options: RenderOptions;
  setOptions: (o: RenderOptions) => void;
};

export default function OptionPanel({ options, setOptions }: Props) {
  function onChange<K extends keyof RenderOptions>(key: K, value: RenderOptions[K]) {
    setOptions({ ...options, [key]: value });
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="text-lg font-semibold">옵션</h3>

      <label className="block text-sm text-gray-600">이미지 생성 모델</label>
      <select value={options.provider} onChange={(e) => onChange('provider', e.target.value as RenderOptions['provider'])} className="w-full p-2 border rounded">
        {imageProviders.map((m) => (
          <option key={m} value={m}>{m === 'openai' ? 'GPT 이미지' : 'Gemini 이미지'}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">무드 템플릿</label>
      <select value={options.moodTemplate} onChange={(e) => onChange('moodTemplate', e.target.value as RenderOptions['moodTemplate'])} className="w-full p-2 border rounded">
        {moodTemplates.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">조명</label>
      <select value={options.lighting} onChange={(e) => onChange('lighting', e.target.value as RenderOptions['lighting'])} className="w-full p-2 border rounded">
        {lightings.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">배경</label>
      <select value={options.background} onChange={(e) => onChange('background', e.target.value as RenderOptions['background'])} className="w-full p-2 border rounded">
        {backgrounds.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">렌즈</label>
      <select value={options.lens} onChange={(e) => onChange('lens', e.target.value as RenderOptions['lens'])} className="w-full p-2 border rounded">
        {lenses.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">비율</label>
      <select value={options.aspectRatio} onChange={(e) => onChange('aspectRatio', e.target.value as RenderOptions['aspectRatio'])} className="w-full p-2 border rounded">
        {aspectRatios.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <label className="block text-sm text-gray-600">품질</label>
      <select value={options.quality} onChange={(e) => onChange('quality', e.target.value as RenderOptions['quality'])} className="w-full p-2 border rounded">
        {qualities.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
