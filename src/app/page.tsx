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
  const [accessCode, setAccessCode] = useState('');
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

    if (!accessCode.trim()) {
      setErrorMessage('포트폴리오 데모는 접근 코드가 있어야 실제 이미지 생성이 가능합니다.');
      return;
    }

    setLoading(true);
    setAfterBase64(null);
    try {
      const fd = new FormData();
      const preparedProductFile = await prepareImageForUpload(productFile);
      const preparedMoodFile = moodFile ? await prepareImageForUpload(moodFile) : null;
      fd.append('productImage', preparedProductFile);
      if (preparedMoodFile) fd.append('moodReferenceImage', preparedMoodFile);
      fd.append('options', JSON.stringify(options));
      fd.append('accessCode', accessCode.trim());

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

          <div className="bg-white rounded-lg shadow p-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600">접근 코드</label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Owner access code"
                autoComplete="off"
              />
            </div>

            <button
              className="w-full px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              onClick={handleGenerate}
              disabled={!productFile || loading}
            >
              {loading ? '생성 중...' : 'Generate'}
            </button>
            {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
          </div>
        </div>

        <div className="md:col-span-2">
          <ResultPreview beforeSrc={beforeSrc} afterBase64={afterBase64} prompt={prompt} loading={loading} onDownload={handleDownload} />
        </div>
      </div>
    </div>
  );
}

async function prepareImageForUpload(file: File) {
  const maxBytes = 1.8 * 1024 * 1024;
  const maxDimension = 1600;

  if (file.size <= maxBytes) {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return file;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  for (const quality of [0.88, 0.78, 0.68, 0.58]) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    if (blob.size <= maxBytes || quality === 0.58) {
      return new File([blob], replaceExtension(file.name, 'jpg'), { type: 'image/jpeg' });
    }
  }

  return file;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 압축할 수 없습니다.'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('이미지를 압축할 수 없습니다.'));
        }
      },
      type,
      quality,
    );
  });
}

function replaceExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  return `${baseName}.${extension}`;
}
