"use client";

import { useMemo, useState } from 'react';
import UploadPanel from '../components/UploadPanel';
import OptionPanel from '../components/OptionPanel';
import ResultPreview from '../components/ResultPreview';
import { defaultOptions } from '../lib/options';
import { buildRenderPrompt } from '../lib/renderPrompt';
import type { RenderOptions } from '../types/render';

export default function Home() {
  const [productFile, setProductFile] = useState<File | null>(null);
  const [moodFile, setMoodFile] = useState<File | null>(null);
  const [options, setOptions] = useState<RenderOptions>(defaultOptions);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [afterBase64, setAfterBase64] = useState<string | null>(null);

  const beforeSrc = useMemo(() => (productFile ? URL.createObjectURL(productFile) : null), [productFile]);
  const prompt = useMemo(() => buildRenderPrompt(options), [options]);

  async function handleGenerate() {
    setErrorMessage(null);
    if (!productFile) {
      setErrorMessage('제품 이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    setAfterBase64(null);
    try {
      const fd = new FormData();
      fd.append('productImage', productFile);
      if (moodFile) fd.append('moodReferenceImage', moodFile);
      fd.append('options', JSON.stringify(options));

      const res = await fetch('/api/render', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || '서버에서 오류가 발생했습니다.');
      } else if (data?.image) {
        setAfterBase64(data.image);
      } else {
        setErrorMessage('이미지 생성에 실패했습니다.');
      }
    } catch {
      setErrorMessage('요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!afterBase64) return;
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${afterBase64}`;
    a.download = 'render-room-result.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <UploadPanel
            productFile={productFile}
            setProductFile={setProductFile}
            moodFile={moodFile}
            setMoodFile={setMoodFile}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />

          <OptionPanel options={options} setOptions={setOptions} />

          <div className="bg-white rounded-lg shadow p-4">
            <button
              className="w-full px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              onClick={handleGenerate}
              disabled={!productFile || loading}
            >
              {loading ? '생성 중...' : 'Generate'}
            </button>
            {errorMessage && <div className="mt-2 text-sm text-red-600">{errorMessage}</div>}
          </div>
        </div>

        <div className="md:col-span-2">
          <ResultPreview beforeSrc={beforeSrc} afterBase64={afterBase64} prompt={prompt} loading={loading} onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
}
