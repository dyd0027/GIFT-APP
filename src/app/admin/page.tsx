'use client';

import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[10px]">
      <Button onClick={() => router.push('/admin/user')} label="유저 등록 및 관리" />
      <Button onClick={() => router.push('/admin/gift')} label="선물 관리" />
    </div>
  );
};

export default AdminPage;
