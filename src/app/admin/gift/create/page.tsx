'use client';

import AdminGiftForm from '@/components/admin/gift/AdminGiftForm';
import Button from '@/components/common/Button';
import { useEffect, useState } from 'react';
import { Gift } from '@/types/Gift';
import { getGiftList } from '@/lib/client/gift/getGiftList';
import { getGift } from '@/lib/client/gift/getGift';
import { GiftDetail } from '@/types/GiftDetail';
import { useRouter } from 'next/navigation';
const CreateGiftPage = () => {
  const router = useRouter();
  const [isPrev, setIsPrev] = useState(false);
  const [prevGift, setPrevGift] = useState<Gift[]>();
  const [prevSeq, setPrevSeq] = useState<number>();
  const [initialGift, setInitialGift] = useState<Gift>();
  const [initialDetails, setInitialDetails] = useState<GiftDetail[]>();
  const handlePrev = async () => {
    if (!isPrev) {
      const res = await getGiftList();
      if (res.ok && !prevGift) {
        setPrevGift(res.data.data);
      }
      if (!res.ok) {
        alert('오류내용:' + res?.message?.toString());
      }
    } else {
      if (!confirm('초기화 하시겠습니까?')) {
        return;
      }
      setPrevSeq(undefined);
    }
    setIsPrev((prev) => !prev);
  };
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
          label="이전 선물 양식 불러오기"
          onClick={() => router.push('/admin/gift/copy')}
          className="w-[220px]"
        />
      </div>
      <AdminGiftForm mode="create" />
    </div>
  );
};

export default CreateGiftPage;
