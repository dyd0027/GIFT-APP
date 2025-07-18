'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900" />
        <span className="ml-4 text-gray-600">로딩 중...</span>
      </div>
    );
  }

  return <>{children}</>;
}
