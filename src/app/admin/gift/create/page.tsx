'use client';

import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';

const CreateGiftPage = () => {
  const [productNm, setProductNm] = useState('');
  const [deliveryDt, setDeliveryDt] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const [detailNm, setDetailNm] = useState('');
  const [detail, setDetail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        DELIVERY_DT: deliveryDt,
      });

      alert('등록되었습니다.');
    } catch (error) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mt-[10px] flex w-full flex-col px-[10px]">
      <div className="flex flex-col gap-2">
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
          <div className="!w-[100px]">선물명</div>
          <input
            type="text"
            placeholder="선물명"
            value={productNm}
            onChange={(e) => setProductNm(e.target.value)}
            className="flex-1 rounded border p-2"
            name="productNm"
          />
        </div>
        <div className="flex w-full justify-center font-bold">상품 추가(1개 이상)</div>
        <div className="flexflex-col flex flex-col items-center gap-[10px] rounded-md border-2 border-solid border-[#c2c2c2] p-[10px]">
          <div className="flex w-full items-center">
            <div className="!w-[100px]">상세 이름</div>
            <input
              type="text"
              placeholder="ex) 벽제갈비 선물세트"
              value={detailNm}
              onChange={(e) => setDetailNm(e.target.value)}
              className="flex-1 rounded border p-2"
              name="detailNm"
            />
          </div>
          <div className="flex w-full items-center">
            <div className="!w-[100px]">상세 품목</div>
            <textarea
              placeholder="ex) 총 1.75kg(특대사이즈 14마리 내외)"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="w-[213px] flex-1 rounded border p-2"
              name="datail"
            />
          </div>
          <div className="flex w-full items-start gap-4">
            <div className="!w-[100px] pt-2">이미지 등록</div>
            <div className="flex flex-col gap-2">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && (
                <img src={previewUrl} alt="미리보기" className="mt-2 w-auto rounded border" />
              )}
            </div>
          </div>
        </div>
        <div>
          <Button label="상품 추가" onClick={() => null} className="float-right w-[120px]" />
        </div>
        <div className="flex items-center">
          <div className="!w-[100px]">수령일 안내</div>
          <textarea
            placeholder="~~"
            value={productNm}
            onChange={(e) => setDeliveryDt(e.target.value)}
            className="w-[213px] flex-1 rounded border p-2"
            name="DELIVERY_DT"
          />
        </div>
      </div>
      <AsyncButton handleSubmit={handleSubmit} label="등록" className="mt-[50px]" />
    </div>
  );
};

export default CreateGiftPage;
