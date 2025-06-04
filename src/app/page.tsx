import LoginForm from './LoginForm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import MainForm from './MainForm';
export default function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  let isLoggedIn = false;

  if (token) {
    try {
      verifyToken(token);
      isLoggedIn = true;
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }
  return (
    <main>
      {isLoggedIn ? <MainForm /> : <LoginForm />}
    </main>
  );
}
