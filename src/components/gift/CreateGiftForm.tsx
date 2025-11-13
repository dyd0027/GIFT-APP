'use client';

import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';
import { useUserStore } from '@/store/userStore';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { formatDateWithDay } from '@/utils/date';
type Props = {
  initialGift?: Gift;
  initialDetails?: GiftDetail[];
};

const CreateGiftForm = ({ initialGift, initialDetails = [] }: Props) => {
  const user = useUserStore((state) => state.user);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStoreSeq, setSelectedStoreSeq] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const giftRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  const selected = initialDetails.find((d) => d.id === selectedId);
  const selectedStore = selected?.storeInfos.find((s) => s.seq === selectedStoreSeq);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const convertToParagraphs = (text: string): string => {
    return text
      .split('\n')
      .map((line) => (line.trim() === '' ? '<p>&nbsp;</p>' : `<p>${line}</p>`))
      .join('');
  };

  useEffect(() => {
    if (initialDetails.length > 0) {
      setSelectedId(initialDetails[0].id);
    }
  }, [initialDetails]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        giftRef.current &&
        !giftRef.current.contains(e.target as Node) &&
        storeRef.current &&
        !storeRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div className="my-[30px] text-center text-[30px] font-bold">신청정보 입력</div>

      <div className="text-center text-[18px]">
        신청정보를 입력 후 저장 해 주세요.
        <br />
        기한내
        <span className="text-[15px]">
          ({initialGift?.startDate?.slice(0, 10)} ~ {initialGift?.endDate?.slice(0, 10)})
        </span>
        변경이 가능합니다.
      </div>

      {/* 직원 인적사항 */}
      <div className="mt-[20px] w-full pl-[10px] text-[20px] font-bold">
        1. 직원 인적사항(수정불가)
      </div>

      <div className="flex w-full flex-col gap-[10px] p-[20px]">
        <div className="flex rounded-md border p-[10px]">
          <p className="w-[100px]">이름</p>
          <p className="font-bold">{user?.login_nm}</p>
        </div>
        <div className="flex rounded-md border p-[10px]">
          <p className="w-[100px]">회사</p>
          <p className="font-bold">{user?.comp_nm}</p>
        </div>
        <div className="flex rounded-md border p-[10px]">
          <p className="w-[100px]">본부</p>
          <p className="font-bold">{user?.hq_nm || '-'}</p>
        </div>
        <div className="flex rounded-md border p-[10px]">
          <p className="w-[100px]">팀</p>
          <p className="font-bold">{user?.dept_nm || '-'}</p>
        </div>
      </div>

      {/* 선물 선택 */}
      <div className="mt-[10px] w-full pl-[10px] text-[20px] font-bold">2. 선물 및 배송지 정보</div>

      <div className="p-[20px]">
        {initialDetails.length > 0 && (
          <>
            {/* Gift dropdown */}
            <div ref={giftRef} className="relative w-full">
              <button
                onClick={() => toggleDropdown('gift')}
                className="flex w-full items-center justify-between rounded border bg-white px-4 py-2 shadow"
              >
                <span>{selected?.detailNm ?? '선물 선택'}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${openDropdown === 'gift' ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openDropdown === 'gift' && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute z-10 w-full rounded border bg-white shadow"
                  >
                    {initialDetails.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setOpenDropdown(null);
                        }}
                        className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                          selectedId === item.id ? 'bg-indigo-50 font-semibold' : ''
                        }`}
                      >
                        {item.detailNm}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* 선택된 상세 정보 */}
            {selected && (
              <>
                {selected.previewUrl && (
                  <img src={selected.previewUrl} className="rounded border" />
                )}

                <div className="my-[10px]">
                  {selected.detailNm}:{selected.detail}
                </div>

                {selected.addDetail && (
                  <div
                    className="text-[crimson]"
                    dangerouslySetInnerHTML={{ __html: convertToParagraphs(selected.addDetail) }}
                  />
                )}

                {/* Store dropdown */}
                {selected.isStoreInfo && selected.storeInfos.length > 0 && (
                  <div className="mt-[24px]">
                    <label className="mb-1 block font-semibold">
                      매장 선택<span className="text-[red]">*</span>
                    </label>

                    <div ref={storeRef} className="relative w-full">
                      <button
                        onClick={() => toggleDropdown('store')}
                        className="flex w-full items-center justify-between rounded border bg-white px-4 py-2 shadow"
                      >
                        <span>
                          {selectedStore ? selectedStore.region : '-- 매장을 선택하세요 --'}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openDropdown === 'store' ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdown === 'store' && (
                          <motion.ul
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 mt-1 w-full rounded border bg-white shadow"
                          >
                            {selected.storeInfos.map((store) => (
                              <li
                                key={store.seq}
                                onClick={() => {
                                  setSelectedStoreSeq(store.seq);
                                  setOpenDropdown(null);
                                }}
                                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                                  selectedStoreSeq === store.seq ? 'bg-indigo-50 font-semibold' : ''
                                }`}
                              >
                                {store.region}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="rounded border bg-white p-4 text-sm">
                      <div>
                        <strong>지역:</strong> {selectedStore?.region}
                      </div>
                      <div>
                        <strong>주소:</strong> {selectedStore?.address}
                      </div>
                      <div>
                        <strong>전화번호:</strong> {selectedStore?.tel}
                      </div>
                    </div>
                  </div>
                )}

                {/* 날짜 선택 */}
                {selected.dateList.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2 font-semibold">
                      날짜 선택<span className="text-[red]">*</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {selected.dateList.map((date) => (
                        <label key={date} className="inline-flex items-center gap-2">
                          <input
                            type="radio"
                            name="deliveryDate"
                            checked={selectedDate === date}
                            onChange={() => setSelectedDate(date)}
                          />
                          <span>{formatDateWithDay(date)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default CreateGiftForm;
