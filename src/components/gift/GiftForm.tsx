'use client';

import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
  initialGift?: Gift;
  initialDetails?: GiftDetail[];
};

const GiftForm = ({ initialGift, initialDetails = [] }: Props) => {
  return (
    <>
      <div className="my-[30px] text-center text-[30px] font-bold">임직원 선물</div>
      <div className="text-center text-[20px] font-bold">{initialGift?.giftNm}</div>
      <div className="mt-[5px] text-center leading-[18px]">
        신청기간
        <br />
        {initialGift?.startDate?.slice(0, 10)} ~ {initialGift?.endDate?.slice(0, 10)}
      </div>

      {/* 슬라이드 */}
      <div className="relative mx-[10px] my-[30px] w-[-webkit-fill-available] rounded border border-[#c2c2c2] p-[10px] shadow">
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4000 }}
          navigation
          pagination={{ clickable: true }}
        >
          {initialDetails.map((detail, i) => (
            <SwiperSlide key={detail.id}>
              <div className="px-[20px] text-sm">
                <div className="mb-2 text-center text-lg font-bold">
                  상세 선물 {i + 1} / {initialDetails.length}
                </div>
                <div className="mb-1">
                  <strong>선물 명:</strong> {detail.detailNm}
                </div>
                <div className="mb-1">
                  <strong>품목:</strong> {detail.detail}
                </div>
                {detail.previewUrl && (
                  <div className="mt-2">
                    <img
                      src={detail.previewUrl}
                      alt="preview"
                      className="h-auto max-h-[300px] w-full rounded border object-contain"
                    />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 수령일 안내 */}
      <div className="mx-[10px] w-[-webkit-fill-available] rounded-md border-2 border-solid border-[#c2c2c2]">
        <div className="p-[10px] font-bold">수령일 안내</div>
        <div
          className="bg-[white] px-[10px] py-[20px] font-bold"
          dangerouslySetInnerHTML={{ __html: initialGift?.notice ?? '' }}
        />
      </div>
    </>
  );
};

export default GiftForm;
