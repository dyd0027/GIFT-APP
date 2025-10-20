'use client';

import DatePicker from 'react-datepicker';
import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';
import TiptapEditor from '@/components/common/TipTopEditor';
import * as XLSX from 'xlsx';
import { useMemo, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { createGift } from '@/lib/client/gift/createGift';
import { updateGift } from '@/lib/client/gift/updateGift';
import { useRouter } from 'next/navigation';
import { GiftDetail } from '@/types/GiftDetail';
import { StoreInfo } from '@/types/StoreInfo';
import { Gift } from '@/types/Gift';

type GiftFormProps = {
  giftSeq?: number; // update할 때만 값이 있음
  initialGift?: Gift;
  initialDetails?: GiftDetail[];
};

const GiftForm = ({ giftSeq, initialGift, initialDetails }: GiftFormProps) => {
  const router = useRouter();
  const [isHtml, setIsHtml] = useState(true);

  const [gift, setGift] = useState<Gift>(() => ({
    giftNm: initialGift?.giftNm ?? '',
    notice: initialGift?.notice ?? '',
    startDate: initialGift?.startDate ?? '',
    endDate: initialGift?.endDate ?? '',
    giftDate: initialGift?.giftDate ?? '',
  }));

  // DatePicker 바인딩용 Date 변환
  const startDateObj = useMemo(
    () => (gift.startDate ? new Date(gift.startDate) : null),
    [gift.startDate]
  );
  const endDateObj = useMemo(() => (gift.endDate ? new Date(gift.endDate) : null), [gift.endDate]);
  const giftDateObj = useMemo(
    () => (gift.giftDate ? new Date(gift.giftDate) : null),
    [gift.giftDate]
  );

  const [details, setDetails] = useState<GiftDetail[]>(
    initialDetails && initialDetails.length > 0
      ? initialDetails
      : [
          {
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
          },
        ]
  );
  const setGiftField = <K extends keyof Gift>(key: K, v: Gift[K]) =>
    setGift((p) => ({ ...p, [key]: v }));

  const addGiftDetail = () => {
    setDetails((prev) => [
      ...prev,
      {
        id: prev.length,
        detailNm: '',
        detail: '',
        addDetail: '',
        imageFile: null,
        previewUrl: null,
        subSort: prev.length,
        dateList: [],
        isReplaceable: false,
        replaceIds: [],
        isStoreInfo: false,
        storeInfos: [],
      },
    ]);
  };

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  };

  const removeGiftDetail = (id: number) => {
    setDetails((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDetailChange = (id: number, key: keyof GiftDetail, value: any) => {
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
    const { giftNm, startDate, endDate, giftDate, notice } = gift;

    if (!giftNm || !startDate || !endDate || !giftDate || !notice) {
      alert('필수 값을 입력해주세요.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      alert('신청 시작날짜는 종료날짜보다 작아야 합니다.');
      return;
    }
    const hasInvalidDetail = details.some(
      (d) => !d.detailNm || !d.detail || (!d.id && !d.imageFile)
    );
    if (hasInvalidDetail) {
      alert('상세 품목 필수 값을 입력해주세요.');
      return;
    }

    try {
      if (!giftSeq) {
        const res = await createGift({
          gift,
          details,
        });
        if (res.ok) {
          alert('등록되었습니다.');
          router.push('./update');
        } else {
          alert(`등록 실패: ${res.message ?? '알 수 없는 오류'}`);
        }
      } else {
        const res = await updateGift({
          giftSeq,
          gift,
          details,
        });
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
        <div>
          <Button
            label={isHtml ? '미리보기' : '작성하기'}
            onClick={() => setIsHtml((prev) => !prev)}
            className="w-[120px]"
          />
        </div>
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
          <div
            key={item.id}
            className="flex flex-col items-center gap-[10px] rounded-md border-2 border-solid border-[#c2c2c2] p-[10px]"
          >
            <div className="flex w-full items-center">
              <div className="!w-[100px]">
                상세 이름<span className="text-[red]">*</span>
              </div>
              <input
                type="text"
                value={item.detailNm}
                onChange={(e) => handleDetailChange(item.id, 'detailNm', e.target.value)}
                className="flex-1 rounded border p-2"
              />
            </div>
            <div className="flex w-full items-center">
              <div className="!w-[100px]">
                상세 품목<span className="text-[red]">*</span>
              </div>
              <textarea
                value={item.detail}
                onChange={(e) => handleDetailChange(item.id, 'detail', e.target.value)}
                className="w-[213px] flex-1 rounded border p-2"
              />
            </div>
            <div className="flex w-full items-center">
              <div className="!w-[100px]">추가 문구</div>
              <textarea
                value={item.addDetail}
                onChange={(e) => handleDetailChange(item.id, 'addDetail', e.target.value)}
                className="w-[213px] flex-1 rounded border p-2"
              />
            </div>
            <div className="flex w-full">
              <div className="!w-[100px]">배송 일</div>
              <div className="flex-1">
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
                  }}
                  dateFormat="yyyy/MM/dd"
                  className="w-[120px] cursor-pointer rounded-md border p-2"
                />
                <div className="text-sm">(미선택 가능, 중복 선택 가능)</div>
                <div className="inline-block">
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
            </div>
            <div className="flex w-full items-start gap-4">
              <div className="!w-[100px]">
                이미지 등록<span className="text-[red]">*</span>
              </div>
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
            <div className="flex w-full">
              <div className="!w-[100px]">대체상품</div>
              <div className="flex-1">
                <select
                  name="isReplaceable"
                  value={item.isReplaceable ? 'Y' : 'N'}
                  onChange={(e) => {
                    const value = e.target.value === 'Y';
                    setDetails((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? { ...i, isReplaceable: value, replaceIds: value ? i.replaceIds : [] }
                          : i
                      )
                    );
                  }}
                  className="w-[100px] rounded border p-2"
                >
                  <option value="N">N</option>
                  <option value="Y">Y</option>
                </select>

                {item.isReplaceable && (
                  <div className="flex flex-col border bg-[white] p-2">
                    <div>
                      대체상품 선택<span className="text-sm">(중복선택 가능)</span>
                      <span className="text-[red]">*</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {details
                        .filter((other) => other.id !== item.id)
                        .map((option) => {
                          const isSelected = item.replaceIds.includes(option.id);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => {
                                setDetails((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          replaceIds: isSelected
                                            ? i.replaceIds.filter((rid) => rid !== option.id)
                                            : [...i.replaceIds, option.id],
                                        }
                                      : i
                                  )
                                );
                              }}
                              className={`rounded border px-3 py-1 ${
                                isSelected
                                  ? 'rounded-full bg-[#2FCBC0] px-3 py-1 text-sm text-white'
                                  : 'border-gray-300 bg-gray-100 text-sm text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {option.detailNm || `상품 ${option.id}`}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full">
              <div className="!w-[100px]">업체주소선택</div>
              <div>
                <select
                  name="isStoreInfo"
                  value={item.isStoreInfo ? 'Y' : 'N'}
                  onChange={(e) => {
                    const value = e.target.value === 'Y';
                    setDetails((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              isStoreInfo: value,
                              storeInfos: value ? i.storeInfos : [],
                            }
                          : i
                      )
                    );
                  }}
                  className="w-[100px] rounded border p-2"
                >
                  <option value="N">N</option>
                  <option value="Y">Y</option>
                </select>
                {item.isStoreInfo && (
                  <div className="flex w-full flex-col gap-2">
                    <a href="/sample.xlsx" download className="text-blue-600 underline">
                      양식 다운로드
                    </a>

                    <div className="flex items-center gap-2">
                      <input
                        id={`file-input-${item.id}`}
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            e.target.value = '';
                            return false;
                          }

                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const sheet = workbook.Sheets[workbook.SheetNames[0]];
                            const parsed = XLSX.utils.sheet_to_json(sheet);

                            if (parsed.length === 0) {
                              alert('엑셀에 데이터가 없습니다.');
                              e.target.value = '';
                              setDetails((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, storeInfos: [] } : i))
                              );
                              return false;
                            }

                            const firstRow = parsed[0] as Record<string, any>;
                            const requiredKeys = ['SEQ', '지역', '주소', '매장전화번호'];
                            const hasAllKeys = requiredKeys.every((key) =>
                              Object.keys(firstRow).includes(key)
                            );

                            if (!hasAllKeys) {
                              alert(
                                '엑셀 형식이 잘못되었습니다. 샘플 액셀을 다운받아서 사용해주세요.'
                              );
                              e.target.value = '';
                              setDetails((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, storeInfos: [] } : i))
                              );
                              return false;
                            }

                            const normalized = XLSX.utils.sheet_to_json(sheet, {
                              header: ['seq', 'region', 'address', 'tel'],
                              range: 1,
                            });
                            const storeInfos: StoreInfo[] = normalized.map((row: any) => ({
                              seq: Number(row.seq),
                              region: String(row.region),
                              address: String(row.address),
                              tel: String(row.tel),
                            }));
                            setDetails((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, storeInfos } : i))
                            );
                            alert('업로드 되었습니다.');
                          };
                          reader.readAsArrayBuffer(file);
                        }}
                      />
                      <label
                        htmlFor={`file-input-${item.id}`}
                        className="cursor-pointer rounded bg-[#2FCBC0] px-4 py-2 text-white hover:bg-[#00B0AD]"
                      >
                        파일 업로드
                      </label>
                    </div>

                    {item.storeInfos.length > 0 ? (
                      <div className="text-sm text-gray-600">
                        총 {item.storeInfos.length}개의 주소가 업로드되었습니다.
                      </div>
                    ) : (
                      <div className="text-sm text-red-500">주소록 업로드 하시길 바랍니다.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {idx !== 0 && (
              <div className="w-full text-right">
                <Button
                  label="삭제"
                  onClick={() => removeGiftDetail(item.id)}
                  className="w-[80px] bg-red-600 text-white hover:bg-red-700"
                />
              </div>
            )}
          </div>
        ))}
        <div>
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
        label={giftSeq ? '수정' : '등록'}
        className="mb-[80px] mt-[50px]"
      />
    </div>
  );
};

export default GiftForm;
