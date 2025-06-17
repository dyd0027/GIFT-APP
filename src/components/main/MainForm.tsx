'use client';
import { useUserStore } from '@/store/userStore';

const MainForm = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);
  return <div>{user?.LOGIN_NM}님 반갑습니다</div>;
};

export default MainForm;
