'use client';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AsyncButton from '@/components/common/AsyncButton';
import Button from '@/components/common/Button';
import TiptapEditor from '@/components/common/TipTopEditor';
interface StoreInfo {
  seq: number;
  region: string;
  address: string;
}
interface ProductDetail {
  id: number;
  detailNm: string;
  detail: string;
  addDetail: string;
  imageFile: File | null;
  previewUrl: string | null;
  subSort: number;
  dateList: string[];
  isReplaceable: boolean;
  replaceId: number | null;
  isStoreInfo: boolean;
  storeInfos: StoreInfo[];
}

const CreateGiftPage = () => {
  const [productNm, setProductNm] = useState('');
  const [deliveryDt, setDeliveryDt] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [isHtml, setIsHtml] = useState(true);

  const [details, setDetails] = useState<ProductDetail[]>([
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
      replaceId: null,
      isStoreInfo: false,
      storeInfos: [],
    },
  ]);

  const addProductDetail = () => {
    setDetails((prev) => [
      ...prev,
      {
        id: details.length,
        detailNm: '',
        detail: '',
        addDetail: '',
        imageFile: null,
        previewUrl: null,
        subSort: details.length,
        dateList: [],
        isReplaceable: false,
        replaceId: null,
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

  useEffect(() => {
    console.log(deliveryDt);
  }, [deliveryDt]);
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
            selected={deliveryDate}
            onChange={(date) => setDeliveryDate(date)}
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
          <div className="!w-[100px]">
            선물명<span className="text-[red]">*</span>
          </div>
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
              <div className="!w-[100px]">
                배송 일<span className="text-[red]">*</span>
              </div>
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
                <div>(중복 선택 가능)</div>
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
              <div>
                <select
                  name="isReplaceable"
                  value={item.isReplaceable ? 'Y' : 'N'}
                  onChange={(e) => {
                    const value = e.target.value === 'Y';
                    setDetails((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              isReplaceable: value,
                              replaceId: value ? i.replaceId : null,
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
                {item.isReplaceable && (
                  <div className="flex w-full items-center">
                    <div className="!w-[120px]">
                      대체상품 선택<span className="text-[red]">*</span>
                    </div>
                    <select
                      value={item.replaceId ?? ''}
                      onChange={(e) => {
                        const selectedId = Number(e.target.value);
                        setDetails((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, replaceId: selectedId } : i))
                        );
                      }}
                      className="flex-1 rounded border p-2"
                    >
                      <option value="">선택 안함</option>
                      {details
                        .filter((other) => other.id !== item.id)
                        .map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.detailNm || `상품 ${option.id}`}
                          </option>
                        ))}
                    </select>
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
                        type="file"
                        accept=".xlsx, .xls"
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
                            const requiredKeys = ['SEQ', '지역', '주소'];
                            const hasAllKeys = requiredKeys.every((key) =>
                              Object.keys(firstRow).includes(key)
                            );

                            if (!hasAllKeys) {
                              alert(
                                '엑셀 형식이 잘못되었습니다. (필수 컬럼: SEQ, 지역, 주소). 샘플 액셀을 다운받아서 사용해주세요.'
                              );
                              e.target.value = '';
                              setDetails((prev) =>
                                prev.map((i) => (i.id === item.id ? { ...i, storeInfos: [] } : i))
                              );
                              return false;
                            }

                            // ✅ StoreInfo[]로 저장
                            const storeInfos: StoreInfo[] = parsed.map((row: any) => ({
                              seq: Number(row.seq),
                              region: String(row.region),
                              address: String(row.address),
                            }));

                            setDetails((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, storeInfos } : i))
                            );
                            alert('업로드 되었습니다.');
                          };
                          reader.readAsArrayBuffer(file);
                        }}
                      />
                    </div>

                    {item.storeInfos.length > 0 && (
                      <div className="text-sm text-gray-600">
                        총 {item.storeInfos.length}개의 주소가 업로드되었습니다.
                      </div>
                    )}
                  </div>
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

        <div className="flex">
          <div className="!w-[100px] pt-[10px]">
            수령일 안내<span className="text-[red]">*</span>
          </div>
          <div className="flex-1">
            <TiptapEditor deliveryDt={deliveryDt} setDeliveryDt={setDeliveryDt} />
          </div>
        </div>
      </div>
      <AsyncButton handleSubmit={handleSubmit} label="등록" className="mt-[50px]" />
    </div>
  );
};

export default CreateGiftPage;
