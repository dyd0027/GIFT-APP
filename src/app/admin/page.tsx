'use client';

import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const router = useRouter();
  return (
    <div className="flex h-full flex-1 flex-col justify-center gap-[10px] px-[10px]">
      <Button onClick={() => router.push('/admin/user')} label="유저 등록 및 관리" />
      <Button onClick={() => router.push('/admin/gift/create')} label="선물 등록" />
      <Button onClick={() => router.push('/admin/gift/update')} label="선물 수정" />
    </div>
  );
};

export default AdminPage;
