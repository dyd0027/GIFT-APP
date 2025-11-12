import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

import LoginForm from '../components/main/LoginForm';
import { verifyToken } from '@/lib/auth';

const HomePage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    let loginId: string | undefined;

    try {
      const decoded = verifyToken(token) as jwt.JwtPayload;
      loginId = decoded?.login_id;
    } catch (err) {
      console.warn('토큰 검증 실패:', err);
    }

    if (loginId) {
      const isAdmin = loginId === process.env.NEXT_PUBLIC_ADMIN_ID;
      redirect(isAdmin ? '/admin' : '/gift');
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-[20px]">
      <LoginForm />
    </div>
  );
};

export default HomePage;
