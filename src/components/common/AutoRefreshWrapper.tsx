'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AutoRefreshWrapper() {
  const router = useRouter();

  useEffect(() => {
    // 페이지 마운트 후 강제 refresh (서버 컴포넌트 리페치)
    router.refresh();
  }, []);

  return null;
}
