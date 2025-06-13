'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface UserExcelRow {
  phone: string;
  name: string;
  company?: string;
  hq?: string;
  dept?: string;
}

export default function UserUploadForm() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('엑셀 파일을 선택해주세요.');

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const [header, ...body] = rows;
    const headerSort = ['전화번호', '이름', '회사명', '본부명', '팀명'];
    const isValidHeader =
      Array.isArray(header) &&
      header.length === headerSort.length &&
      header.every((col, idx) => col === headerSort[idx]);
    if (!isValidHeader) {
      return alert('엑셀의 첫 줄은 [전화번호, 이름, 회사명, 본부명, 팀명] 순이어야 합니다.');
    }

    const insertData: UserExcelRow[] = [];
    const phoneSet = new Set<string>();
    const duplicates: string[] = [];

    for (const row of body) {
      const [phoneRaw, name, company, hq, dept] = row;
      const phone = String(phoneRaw).replace(/[^0-9]/g, '');

      if (!phone) return alert('전화번호가 없는 행이 있습니다.');
      if (!name) return alert(`${phone} 번호에 해당하는 이름이 없습니다.`);
      if (phone === 'sangsangin') continue; // 관리자 제외

      if (phoneSet.has(phone)) {
        duplicates.push(phone);
        continue;
      }

      phoneSet.add(phone);
      insertData.push({ phone, name, company, hq, dept });
    }

    if (duplicates.length > 0) {
      return alert(`중복된 전화번호가 있습니다: ${duplicates.join(', ')}`);
    }
    const res = await fetch('/api/admin/user/replace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: insertData }),
    });
    console.log('res', res);
    if (!res.ok) return alert('업로드 중 오류가 발생했습니다.');
    alert('전체 인원 업로드 완료!');
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-bold">전체 인원 엑셀 업로드</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        업로드
      </button>
    </div>
  );
}
