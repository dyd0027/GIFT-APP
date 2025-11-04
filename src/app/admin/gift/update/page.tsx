import GiftForm from '@/components/admin/gift/GiftForm';
import AutoRefreshWrapper from '@/components/common/AutoRefreshWrapper';
import { getLatestGiftData } from '@/lib/server/gift/getLatestGiftData';

// 서버 컴포넌트
export default async function UpdateGiftPage() {
  const latest = await getLatestGiftData();
  if (!latest) {
    return <div className="p-6">데이터가 없습니다.</div>;
  }

  return (
    <>
      <AutoRefreshWrapper />
      <GiftForm
        mode="update"
        giftSeq={latest.giftSeq}
        initialGift={latest.initialGift}
        initialDetails={latest.initialDetails}
      />
    </>
  );
}
