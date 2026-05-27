"use client";

import { useEffect, useMemo } from 'react';

type Props = {
  productFile: File | null;
  setProductFile: (f: File | null) => void;
  moodFile: File | null;
  setMoodFile: (f: File | null) => void;
  errorMessage: string | null;
  setErrorMessage: (s: string | null) => void;
};

const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

export default function UploadPanel({ productFile, setProductFile, moodFile, setMoodFile, errorMessage, setErrorMessage }: Props) {
  const preview = useMemo(() => (productFile ? URL.createObjectURL(productFile) : null), [productFile]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function validateFile(file: File, label: string) {
    if (!allowedTypes.includes(file.type)) {
      return `${label}는 PNG/JPEG/WEBP만 사용할 수 있습니다.`;
    }

    if (file.size > 10 * 1024 * 1024) {
      return `${label} 크기는 10MB 이하만 사용할 수 있습니다.`;
    }

    return null;
  }

  function handleProduct(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const f = e.target.files?.[0] ?? null;
    if (f) {
      const validationError = validateFile(f, '제품 이미지');
      if (validationError) {
        setErrorMessage(validationError);
        return setProductFile(null);
      }
    }
    setProductFile(f);
  }

  function handleMood(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage(null);
    const f = e.target.files?.[0] ?? null;
    if (f) {
      const validationError = validateFile(f, '무드 참고 이미지');
      if (validationError) {
        setErrorMessage(validationError);
        return setMoodFile(null);
      }
    }
    setMoodFile(f);
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h3 className="text-lg font-semibold">이미지 업로드</h3>
      <div>
        <label className="block text-sm text-gray-600">제품 사진 (필수)</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleProduct} />
      </div>
      {preview && (
        <div className="w-full h-48 bg-gray-50 rounded mt-2 flex items-center justify-center overflow-hidden">
          <img src={preview} alt="before" className="object-contain w-full h-full" />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600">무드 참고 이미지 (선택)</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleMood} />
        {moodFile && <div className="text-sm text-gray-500">선택된 참고 이미지: {moodFile.name}</div>}
      </div>

      {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
    </div>
  );
}
