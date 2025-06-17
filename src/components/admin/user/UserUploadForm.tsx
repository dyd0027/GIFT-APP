'use client';

import { useRef, useState } from 'react';
import { parseExcelFile } from '@/utils/parseExcel';

export default function UserUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('엑셀 파일을 선택해주세요.');

    const result = await parseExcelFile(file);
    if (typeof result === 'string') return alert(result); // 에러 메시지 처리
    const res = await fetch('/api/admin/user/replace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: result }),
    });
    if (!res.ok) return alert('업로드 중 오류가 발생했습니다.');
    alert('전체 인원 업로드 완료!');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-bold">전체 인원 엑셀 업로드</h2>
      <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD]"
      >
        업로드
      </button>
    </div>
  );
}
