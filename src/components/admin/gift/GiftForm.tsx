'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';
import TiptapEditor from '@/components/common/TipTopEditor';

import { createGift } from '@/lib/client/gift/createGift';
import { updateGift } from '@/lib/client/gift/updateGift';

import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';

import GiftDetailCard from './GiftDetailCard'; // 추출한 컴포넌트

const EMPTY_DETAIL: GiftDetail = {
  id: 0,
  detailNm: '',
  detail: '',
  addDetail: '',
  imageFile: null,
  previewUrl: null,
  subSort: 0,
  dateList: [],
  isReplaceable: false,
  replaceIds: [],
  isStoreInfo: false,
  storeInfos: [],
};

type GiftFormProps = {
  mode: 'create' | 'copy' | 'update';
  giftSeq?: number;
  initialGift?: Gift;
  initialDetails?: GiftDetail[];
};

const GiftForm = ({ mode, giftSeq, initialGift, initialDetails }: GiftFormProps) => {
  const router = useRouter();
  const [isHtml, setIsHtml] = useState(true);

  const [gift, setGift] = useState<Gift>({
    giftNm: '',
    notice: '',
    startDate: '',
    endDate: '',
    giftDate: '',
  });

  const [details, setDetails] = useState<GiftDetail[]>([EMPTY_DETAIL]);

  const setGiftField = <K extends keyof Gift>(key: K, v: Gift[K]) =>
    setGift((p) => ({ ...p, [key]: v }));

  const startDateObj = useMemo(
    () => (gift.startDate ? new Date(gift.startDate) : null),
    [gift.startDate]
  );
  const endDateObj = useMemo(() => (gift.endDate ? new Date(gift.endDate) : null), [gift.endDate]);
  const giftDateObj = useMemo(
    () => (gift.giftDate ? new Date(gift.giftDate) : null),
    [gift.giftDate]
  );
  const urlToFile = async (url: string, fileName: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  };
  const initializeForm = () => {
    setGift({
      giftNm: initialGift?.giftNm ?? '',
      notice: initialGift?.notice ?? '',
      startDate: initialGift?.startDate ?? '',
      endDate: initialGift?.endDate ?? '',
      giftDate: initialGift?.giftDate ?? '',
    });

    setDetails(
      initialDetails && initialDetails.length > 0
        ? initialDetails.map((d) => ({ ...d }))
        : [{ ...EMPTY_DETAIL }]
    );
  };

  useEffect(() => {
    const init = async () => {
      if (mode === 'copy' && initialDetails) {
        const mappedDetails = await Promise.all(
          initialDetails.map(async (d, idx) => {
            let imageFile: File | null = null;

            if (d.previewUrl) {
              try {
                const ext = d.previewUrl.split('.').pop()?.split('?')[0] || 'png';
                const fileName = `copied_${idx}.${ext}`;
                imageFile = await urlToFile(d.previewUrl, fileName);
              } catch (e) {
                console.warn('이미지 복사 실패:', e);
              }
            }

            return {
              ...d,
              id: idx,
              subSort: idx,
              imageFile,
            };
          })
        );

        setGift({
          giftNm: initialGift?.giftNm ?? '',
          notice: initialGift?.notice ?? '',
          startDate: initialGift?.startDate ?? '',
          endDate: initialGift?.endDate ?? '',
          giftDate: initialGift?.giftDate ?? '',
        });

        setDetails(mappedDetails);
      } else {
        initializeForm();
      }
    };

    init();
  }, [mode, initialGift, initialDetails]);

  const addGiftDetail = () => {
    setDetails((prev) => [
      ...prev,
      {
        ...EMPTY_DETAIL,
        id: prev.length,
        subSort: prev.length,
      },
    ]);
  };

  const removeGiftDetail = (id: number) => {
    setDetails((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDetailChange = (id: number, key: keyof GiftDetail, value: any) => {
    setDetails((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const validateForm = () => {
    const { giftNm, startDate, endDate, giftDate, notice } = gift;

    if (!giftNm || !startDate || !endDate || !giftDate || !notice) {
      alert('필수 값을 입력해주세요.');
      return false;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert('신청 시작날짜는 종료날짜보다 작아야 합니다.');
      return false;
    }

    const hasInvalidDetail = details.some((d) => {
      if (!d.detailNm || !d.detail) return true;

      // create나 copy일 땐 imageFile 필수
      if ((mode === 'create' || mode === 'copy') && !d.imageFile) return true;

      // update일 경우, imageFile 없어도 OK
      return false;
    });

    if (hasInvalidDetail) {
      alert('상세 품목 필수 값을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (mode === 'create' || mode === 'copy') {
        const res = await createGift({ gift, details });
        if (res.ok) {
          alert('등록되었습니다.');
          router.push('/admin');
        } else {
          alert(`등록 실패: ${res.message ?? '알 수 없는 오류'}`);
        }
      }

      if (mode === 'update' && giftSeq) {
        const res = await updateGift({ giftSeq, gift, details });
        if (res.ok) {
          alert('수정되었습니다.');
        } else {
          alert(`수정 실패: ${res.message ?? '알 수 없는 오류'}`);
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? '에러가 발생했습니다.');
    }
  };

  return (
    <div className="mt-[10px] flex w-full flex-col px-[10px]">
      <div className="flex flex-col gap-2">
        <Button
          label={isHtml ? '미리보기' : '작성하기'}
          onClick={() => setIsHtml((prev) => !prev)}
          className="w-[120px]"
        />

        {/* 기본 정보 입력 */}
        <div className="flex items-center">
          <div className="!w-[100px]">
            선물 년/월<span className="text-[red]">*</span>
          </div>
          <DatePicker
            selected={giftDateObj}
            onChange={(date) => setGiftField('giftDate', date ? date.toISOString() : '')}
            dateFormat="yyyy/MM"
            className="w-[90px] cursor-pointer rounded-md border p-2"
            showMonthYearPicker
          />
        </div>

        <div className="flex items-center">
          <div className="!w-[100px]">
            신청기간<span className="text-[red]">*</span>
          </div>
          <DatePicker
            selected={startDateObj}
            onChange={(date) => setGiftField('startDate', date ? date.toISOString() : '')}
            dateFormat="yyyy/MM/dd"
            className="w-[100px] cursor-pointer rounded-md border p-2"
          />
          ~
          <DatePicker
            selected={endDateObj}
            onChange={(date) => setGiftField('endDate', date ? date.toISOString() : '')}
            dateFormat="yyyy/MM/dd"
            className="w-[100px] cursor-pointer rounded-md border p-2"
          />
        </div>

        <div className="flex items-center">
          <div className="!w-[100px]">
            선물명<span className="text-[red]">*</span>
          </div>
          <input
            type="text"
            placeholder="선물명"
            value={gift.giftNm}
            onChange={(e) => setGiftField('giftNm', e.target.value)}
            className="flex-1 rounded border p-2"
          />
        </div>

        <div className="flex w-full justify-center font-bold">상품 추가(1개 이상)</div>
        {details.map((item, idx) => (
          <GiftDetailCard
            key={item.id}
            detail={item}
            allDetails={details}
            onChange={(key, value) => handleDetailChange(item.id, key, value)}
            onRemove={() => removeGiftDetail(item.id)}
            onImageChange={(file) => {
              handleDetailChange(item.id, 'imageFile', file);
              handleDetailChange(item.id, 'previewUrl', file ? URL.createObjectURL(file) : null);
            }}
          />
        ))}

        <div className="mt-2">
          <Button label="상품 추가" onClick={addGiftDetail} className="float-right w-[120px]" />
        </div>

        <div className="flex">
          <div className="!w-[100px] pt-[10px]">
            수령일 안내<span className="text-[red]">*</span>
          </div>
          <div className="flex-1">
            <TiptapEditor
              notice={gift.notice}
              setNotice={(v: string) => setGiftField('notice', v)}
            />
          </div>
        </div>
      </div>

      <AsyncButton
        handleSubmit={handleSubmit}
        label={mode === 'update' ? '수정' : '등록'}
        className="mb-[80px] mt-[50px]"
      />
    </div>
  );
};

export default GiftForm;
