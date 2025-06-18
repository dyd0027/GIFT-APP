'use client';

import AsyncButton from '@/components/common/AsyncButton';
import { useState } from 'react';

const UserInsertForm = () => {
  const [form, setForm] = useState({
    phone: '',
    name: '',
    company: '',
    hq: '',
    dept: '',
  });

  const formatPhoneNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, '');

    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      const formatted = formatPhoneNumber(onlyNums);
      setForm((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const phone = form.phone.replace(/[^0-9]/g, '');

    if (!phone) return alert('전화번호를 입력해주세요.');
    if (!form.name) return alert('이름을 입력해주세요.');
    if (!/^\d{10,11}$/.test(phone)) return alert('전화번호 형식이 올바르지 않습니다.');

    const res = await fetch('/api/admin/user/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        name: form.name.trim(),
        company: form.company.trim(),
        hq: form.hq.trim(),
        dept: form.dept.trim(),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      return alert(`오류 발생: ${error.message}`);
    }

    alert('유저가 성공적으로 등록되었습니다.');
    setForm({ phone: '', name: '', company: '', hq: '', dept: '' });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-bold">개인 유저 수기 등록</h2>

      <div className="flex flex-col space-y-2">
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="전화번호 (숫자만)"
          inputMode="numeric"
          className="rounded border p-2"
          maxLength={13}
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="이름"
          className="rounded border p-2"
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="회사명"
          className="rounded border p-2"
        />
        <input
          name="hq"
          value={form.hq}
          onChange={handleChange}
          placeholder="본부명"
          className="rounded border p-2"
        />
        <input
          name="dept"
          value={form.dept}
          onChange={handleChange}
          placeholder="팀명"
          className="rounded border p-2"
        />
      </div>

      <AsyncButton handleSubmit={handleSubmit} label="등록하기" />
    </div>
  );
};

export default UserInsertForm;
