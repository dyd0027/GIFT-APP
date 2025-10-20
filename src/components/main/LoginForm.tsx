'use client';

import { useState } from 'react';

import { useUserStore } from '@/store/userStore';

const LoginForm = () => {
  const [loginId, setLoginId] = useState('');
  const [loginNm, setLoginNm] = useState('');
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ login_id: loginId, login_nm: loginNm }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();
    if (result.success) {
      console.log('reslut.uer', result.user);
      setUser(result.user);
      window.location.reload();
    } else {
      alert('로그인에 실패하셨습니다\n전화번호 및 이름을 다시 확인하세요.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-md"
    >
      <h1 className="text-center text-2xl font-bold">선물 신청 로그인</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700">전화번호</label>
        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="01012345678"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">이름</label>
        <input
          type="text"
          value={loginNm}
          onChange={(e) => setLoginNm(e.target.value)}
          placeholder="홍길동"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        로그인
      </button>
    </form>
  );
};
export default LoginForm;
