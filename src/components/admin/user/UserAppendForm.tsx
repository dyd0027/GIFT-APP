'use client';

import { useRef, useState } from 'react';
import { parseExcelFile } from '@/utils/parseExcel';
import AsyncButton from '@/components/common/AsyncButton';

const UserAppendForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('엑셀 파일을 선택해주세요.');
    if (!confirm('업로드 하시겠습니까?')) {
      return;
    }
    const result = await parseExcelFile(file);
    if (typeof result === 'string') return alert(result); // 에러 메시지 처리

    const res = await fetch('/api/admin/user/append', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: result }),
    });

    if (!res.ok) return alert('추가 업로드 중 오류가 발생했습니다.');

    alert('추가 인원 업로드 완료!');
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-bold">추가 인원 엑셀 업로드</h2>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="w-[70%] flex-1"
        />
        <AsyncButton handleSubmit={handleUpload} label="업로드" />
      </div>
    </div>
  );
};
export default UserAppendForm;
