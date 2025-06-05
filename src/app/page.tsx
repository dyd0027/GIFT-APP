import { cookies } from 'next/headers';

import LoginForm from './LoginForm';
import MainForm from './MainForm';

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
  return <main>{isLoggedIn ? <MainForm /> : <LoginForm />}</main>;
};

export default HomePage;
