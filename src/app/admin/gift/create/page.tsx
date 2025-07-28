'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';

interface ProductDetail {
  id: number;
  detailNm: string;
  detail: string;
  imageFile: File | null;
  previewUrl: string | null;
  subSort: number;
  dateList: string[];
}

const CreateGiftPage = () => {
  const [productNm, setProductNm] = useState('');
  const [deliveryDt, setDeliveryDt] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ [key: number]: Date | null }>({});

  const [details, setDetails] = useState<ProductDetail[]>([
    {
      id: 0,
      detailNm: '',
      detail: '',
      imageFile: null,
      previewUrl: null,
      subSort: 0,
      dateList: [],
    },
  ]);

  const addProductDetail = () => {
    setDetails((prev) => [
      ...prev,
      {
        id: details.length,
        detailNm: '',
        detail: '',
        imageFile: null,
        previewUrl: null,
        subSort: details.length,
        dateList: [],
      },
    ]);
  };
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const removeProductDetail = (id: number) => {
    setDetails((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDetailChange = (id: number, key: keyof ProductDetail, value: any) => {
    setDetails((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const handleImageChange = (id: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDetails((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                imageFile: file,
                previewUrl: reader.result as string,
              }
            : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!productNm || !startDate || !endDate || !deliveryDate) {
      alert('모든 값을 입력해주세요');
      return;
    }

    // TODO: FormData를 사용하여 detail 이미지와 정보까지 같이 업로드할 수 있도록 확장
    alert('등록 로직은 개발 중입니다.');
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
          />
        </div>

        <div className="flex w-full justify-center font-bold">상품 추가(1개 이상)</div>
        {details.map((item, idx) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-[10px] rounded-md border-2 border-solid border-[#c2c2c2] p-[10px]"
          >
            <div className="flex w-full items-center">
              <div className="!w-[100px]">상세 이름</div>
              <input
                type="text"
                value={item.detailNm}
                onChange={(e) => handleDetailChange(item.id, 'detailNm', e.target.value)}
                className="flex-1 rounded border p-2"
              />
            </div>
            <div className="flex w-full items-center">
              <div className="!w-[100px]">상세 품목</div>
              <textarea
                value={item.detail}
                onChange={(e) => handleDetailChange(item.id, 'detail', e.target.value)}
                className="w-[213px] flex-1 rounded border p-2"
              />
            </div>
            <div className="flex w-full items-center">
              <div className="!w-[100px]">신청 날짜</div>
              <DatePicker
                selected={null}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  const formatted = formatDate(date);

                  setDetails((prev) =>
                    prev.map((i) =>
                      i.id === item.id
                        ? {
                            ...i,
                            dateList: Array.from(new Set([...i.dateList, formatted])).sort(),
                          }
                        : i
                    )
                  );
                  setSelectedDate((prev) => ({ ...prev, [item.id]: date }));
                }}
                dateFormat="yyyy/MM/dd"
                className="w-[120px] cursor-pointer rounded-md border p-2"
              />
            </div>
            <div className="flex w-full items-center gap-2">
              {item.dateList.length > 0 && <div className="!w-[100px]">선택된 날짜</div>}
              <div className="inline-block flex-1">
                {item.dateList.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="m-[3px] inline-flex items-center gap-1 rounded-full bg-[#2FCBC0] px-3 py-1 text-sm text-white"
                  >
                    {dateStr}
                    <button
                      type="button"
                      className="ml-1 text-white hover:text-red-500"
                      onClick={() => {
                        setDetails((prev) =>
                          prev.map((i) =>
                            i.id === item.id
                              ? { ...i, dateList: i.dateList.filter((d) => d !== dateStr) }
                              : i
                          )
                        );
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full items-start gap-4">
              <div className="!w-[100px] pt-2">이미지 등록</div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(item.id, e.target.files?.[0] || null)}
                />
                {item.previewUrl && (
                  <img src={item.previewUrl} alt="미리보기" className="mt-2 rounded border" />
                )}
              </div>
            </div>
            {idx !== 0 && (
              <div className="w-full text-right">
                <Button
                  label="삭제"
                  onClick={() => removeProductDetail(item.id)}
                  className="w-[80px] bg-red-600 text-white hover:bg-red-700"
                />
              </div>
            )}
          </div>
        ))}
        <div>
          <Button label="상품 추가" onClick={addProductDetail} className="float-right w-[120px]" />
        </div>

        <div className="flex items-center">
          <div className="!w-[100px]">수령일 안내</div>
          <textarea
            placeholder="~~"
            value={deliveryDt}
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
