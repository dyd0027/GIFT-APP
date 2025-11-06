'use client';

import AdminGiftForm from '@/components/admin/gift/AdminGiftForm';
import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import { Gift } from '@/types/Gift';
import { getGiftList } from '@/lib/client/gift/getGiftList';
import { getGift } from '@/lib/client/gift/getGift';
import { GiftDetail } from '@/types/GiftDetail';
import { useRouter } from 'next/navigation';
const CopyGiftPage = () => {
  const router = useRouter();
  const [prevGift, setPrevGift] = useState<Gift[]>();
  const [prevSeq, setPrevSeq] = useState<number>();
  const [initialGift, setInitialGift] = useState<Gift>();
  const [initialDetails, setInitialDetails] = useState<GiftDetail[]>();
  useEffect(() => {
    const fetchGifts = async () => {
      const res = await getGiftList();
      if (res.ok) {
        setPrevGift(res.data.data);
      } else {
        alert('이전 선물 목록 불러오기 실패');
      }
    };

    fetchGifts();
  }, []);
  useEffect(() => {
    if (prevSeq) {
      getGift(prevSeq).then((res) => {
        if (res.ok && res.data) {
          setInitialGift(res.data.initialGift);
          setInitialDetails(res.data.initialDetails);
        }
      });
    } else {
      setInitialGift(undefined);
      setInitialDetails(undefined);
    }
  }, [prevSeq]);
  return (
    <div className="flex flex-col">
      <div className="px-[10px]">
        <Button
          label="초기화"
          onClick={() => router.push('/admin/gift/create')}
          className="w-[220px]"
        />
        <div>
          <select
            name="prevGift"
            className="rounded border p-2"
            onChange={(e) => setPrevSeq(Number(e.target.value))}
          >
            <option value={undefined}>미선택</option>
            {prevGift?.map((gift) => (
              <option key={gift.seq} value={gift.seq}>
                {`${gift.giftDate}: ${gift.giftNm}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AdminGiftForm mode="copy" initialDetails={initialDetails} initialGift={initialGift} />
    </div>
  );
};

export default CopyGiftPage;
