'use client';

import GiftForm from '@/components/admin/gift/GiftForm';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { Gift } from '@/types/Gift';
import { getGiftList } from '@/lib/api';
const CreateGiftPage = () => {
  const [isPrev, setIsPrev] = useState(false);
  const [prevGift, setPrevGift] = useState<Gift[]>();
  const handlePrev = async () => {
    setIsPrev((prev) => !prev);
    if (!isPrev) {
      const res = await getGiftList();
      if (res.ok && !prevGift) {
        console.log(res.data.data);
        setPrevGift(res.data.data);
      }
      if (!res.ok) {
        alert('오류내용:' + res?.message?.toString());
      }
    }
  };
  return (
    <div className="flex flex-col">
      <div className="px-[10px]">
        <Button
          label={isPrev ? '초기화' : '이전 선물 양식 불러오기'}
          onClick={handlePrev}
          className="w-[220px]"
        />
        {isPrev && (
          <div>
            <select name="prevGift" className="rounded border p-2">
              <option value={''}>미선택</option>
              {prevGift?.map((gift) => (
                <option key={gift.seq} value={gift.seq}>
                  {`${gift.giftDate}: ${gift.giftNm}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <GiftForm />;
    </div>
  );
};

export default CreateGiftPage;
