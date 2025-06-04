'use client';

import { useUserStore } from '@/store/userStore';
import { useState } from 'react';

const LoginForm = () => {
  const [loginId, setLoginId] = useState('');
  const [loginNm, setLoginNm] = useState('');
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ LOGIN_ID: loginId, LOGIN_NM: loginNm }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();
    if (result.success) {
      console.log('reslut.uer',result.user);
      setUser(result.user);
      window.location.reload();
    } else {
      alert('로그인에 실패하셨습니다\n전화번호 및 이름을 다시 확인하세요.');
    }
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded-xl shadow-md mt-8"
      >
        <h1 className="text-2xl font-bold text-center">선물 신청 로그인</h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">전화번호</label>
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="01012345678"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            value={loginNm}
            onChange={(e) => setLoginNm(e.target.value)}
            placeholder="홍길동"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
  );
}
export default LoginForm;