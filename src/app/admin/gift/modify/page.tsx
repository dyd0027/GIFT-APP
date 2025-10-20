import GiftForm from '@/components/admin/gift/GiftForm';
import { getLatestGiftData } from '@/app/api/admin/gift/get/lastGift/route';

// 서버 컴포넌트
export default async function ModifyGiftPage() {
  const latest = await getLatestGiftData();
  if (!latest) {
    return <div className="p-6">데이터가 없습니다.</div>;
  }

  return (
    <GiftForm
      giftSeq={latest.giftSeq}
      initialGift={latest.initialGift}
      initialDetails={latest.initialDetails}
    />
  );
}
