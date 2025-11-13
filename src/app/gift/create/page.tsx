import AutoRefreshWrapper from '@/components/common/AutoRefreshWrapper';
import CreateGiftForm from '@/components/gift/CreateGiftForm';
import { getLatestGiftData } from '@/lib/server/gift/getLatestGiftData';

// 서버 컴포넌트
export default async function CreateGiftPage() {
  const latest = await getLatestGiftData();
  if (!latest) {
    return <div className="p-6">데이터가 없습니다.</div>;
  }

  return (
    <>
      <AutoRefreshWrapper />
      <CreateGiftForm
        initialGift={latest.initialGift}
        initialDetails={latest.initialDetails ?? []}
      />
    </>
  );
}
