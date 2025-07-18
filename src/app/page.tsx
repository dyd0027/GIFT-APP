import { cookies } from 'next/headers';

import LoginForm from '../components/main/LoginForm';
import MainForm from '../components/main/MainForm';

import { verifyToken } from '@/lib/auth';

const HomePage = () => {
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
  return <>{isLoggedIn ? <MainForm /> : <LoginForm />}</>;
};

export default HomePage;
