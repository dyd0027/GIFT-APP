'use client';

import GiftForm from '@/components/admin/gift/GiftForm';
import Button from '@/components/common/Button';
import { useState } from 'react';
import { Product } from '@/types/Product';
import { getGiftList } from '@/lib/api';
const CreateGiftPage = () => {
  const [isPrev, setIsPrev] = useState(false);
  const [prevProduct, setPrevProduct] = useState<Product[]>();
  const handlePrev = async () => {
    setIsPrev((prev) => !prev);
    if (!isPrev) {
      const res = await getGiftList();
      if (res.ok && !prevProduct) {
        console.log(res.data.data);
        setPrevProduct(res.data.data);
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
            <select name="prevProduct" className="rounded border p-2">
              <option value={''}>미선택</option>
              {prevProduct?.map((product) => (
                <option key={product.seq} value={product.seq}>
                  {`${product.productDate}: ${product.productNm}`}
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
