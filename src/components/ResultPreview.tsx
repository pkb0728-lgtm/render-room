"use client";

import { useState } from 'react';

type Props = {
  beforeSrc?: string | null;
  afterBase64?: string | null;
  prompt?: string;
  loading?: boolean;
  onDownload?: () => void;
};

export default function ResultPreview({ beforeSrc, afterBase64, prompt, loading, onDownload }: Props) {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 min-h-[420px] flex flex-col">
      <h3 className="text-lg font-semibold">Before / After</h3>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div className="border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
          {beforeSrc ? (
            <img src={beforeSrc} alt="before" className="object-contain w-full h-64" />
          ) : (
            <div className="text-gray-400">제품 이미지를 업로드하세요</div>
          )}
        </div>

        <div className="border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
          {loading ? (
            <div className="text-gray-600">생성 중...</div>
          ) : afterBase64 ? (
            <img src={`data:image/png;base64,${afterBase64}`} alt="after" className="object-contain w-full h-64" />
          ) : (
            <div className="text-gray-400">아직 결과가 없습니다</div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" checked={showPrompt} onChange={(e) => setShowPrompt(e.target.checked)} />
            프롬프트 미리보기
          </label>
        </div>

        <div className="flex items-center gap-2">
          {afterBase64 && (
            <button onClick={onDownload} className="px-3 py-2 bg-gray-900 text-white rounded">다운로드</button>
          )}
        </div>
      </div>

      {showPrompt && (
        <pre className="mt-3 p-3 bg-gray-100 rounded text-sm overflow-auto whitespace-pre-wrap">{prompt}</pre>
      )}
    </div>
  );
}
