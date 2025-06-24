'use client';

import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';

const CreateGiftPage = () => {
  const [productNm, setProductNm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const handleSubmit = async () => {
    if (!productNm || !startDate || !endDate || !deliveryDate) {
      alert('모든 값을 입력해주세요');
      return;
    }

    const format = (d: Date, f: string) =>
      f === 'YYYYMMDD'
        ? d.toISOString().slice(0, 10).replace(/-/g, '')
        : f === 'YYYYMM'
          ? d.toISOString().slice(0, 7).replace('-', '')
          : '';

    try {
      const res = await axios.post('/api/admin/gift/create', {
        PRODUCT_NM: productNm,
        PRODUCT_STDT: format(startDate, 'YYYYMMDD'),
        PRODUCT_EDDT: format(endDate, 'YYYYMMDD'),
        DELIVERY_DT: format(deliveryDate, 'YYYYMM'),
      });

      alert('등록되었습니다.');
    } catch (error) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col">
      <Button label="미리보기" onClick={() => null} className="w-[120px]" />
      <div className="flex flex-col gap-2 px-[10p]">
        <div className="flex items-center">
          <div className="!w-[100px]">선물명</div>
          <input
            type="text"
            placeholder="선물명"
            value={productNm}
            onChange={(e) => setProductNm(e.target.value)}
            className="rounded border p-2"
            name="productNm"
          />
        </div>
        <div className="flex items-center">
          <div className="!w-[100px]">상세 품목</div>
          <textarea
            placeholder="ex) 총 1.75kg(특대사이즈 14마리 내외)"
            value={productNm}
            onChange={(e) => setProductNm(e.target.value)}
            className="w-[213px] rounded border p-2"
            name="productNm"
          />
        </div>
        <div className="flex items-center">
          <div className="!w-[100px]">신청기간</div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            className="w-[100px] cursor-pointer rounded-md border p-2"
          />
          ~
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
            className="w-[100px] cursor-pointer rounded-md border p-2"
          />
        </div>
        <div className="flex items-center">
          <div className="!w-[100px]">선물 년/월</div>
          <DatePicker
            selected={deliveryDate}
            onChange={(date) => setDeliveryDate(date)}
            dateFormat="yyyy/MM"
            className="w-[90px] cursor-pointer rounded-md border p-2"
            showMonthYearPicker
          />
        </div>
      </div>
      <AsyncButton handleSubmit={handleSubmit} label="등록" />
    </div>
  );
};

export default CreateGiftPage;
