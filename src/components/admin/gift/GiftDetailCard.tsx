'use client';

import { GiftDetail } from '@/types/GiftDetail';
import { StoreInfo } from '@/types/StoreInfo';
import Button from '@/components/common/Button';
import DatePicker from 'react-datepicker';
import * as XLSX from 'xlsx';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

type GiftDetailCardProps = {
  detail: GiftDetail;
  allDetails: GiftDetail[];
  onChange: (key: keyof GiftDetail, value: any) => void;
  onImageChange: (file: File | null) => void;
  onRemove: () => void;
};

const GiftDetailCard = ({
  detail,
  allDetails,
  onChange,
  onImageChange,
  onRemove,
}: GiftDetailCardProps) => {
  const addDate = (date: Date | null) => {
    if (!date) return;
    const formatted = format(date, 'yyyyMMdd');

    const next = Array.from(new Set([...detail.dateList, formatted])).sort();
    onChange('dateList', next);
  };

  const removeDate = (date: string) => {
    onChange(
      'dateList',
      detail.dateList.filter((d) => d !== date)
    );
  };

  const handleExcelUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(sheet);

      if (parsed.length === 0) {
        alert('엑셀에 데이터가 없습니다.');
        onChange('storeInfos', []);
        return;
      }

      const firstRow = parsed[0] as Record<string, any>;
      const requiredKeys = ['SEQ', '지역', '주소', '매장전화번호'];
      const valid = requiredKeys.every((key) => Object.keys(firstRow).includes(key));

      if (!valid) {
        alert('엑셀 형식이 잘못되었습니다. 샘플 양식을 사용해주세요.');
        onChange('storeInfos', []);
        return;
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

      onChange('storeInfos', storeInfos);
      alert('업로드 완료!');
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col items-center gap-[10px] rounded-md border-2 border-solid border-[#c2c2c2] p-[10px]">
      {/* 상세 이름 */}
      <div className="flex w-full items-center">
        <div className="!w-[100px]">
          상세 이름<span className="text-[red]">*</span>
        </div>
        <input
          type="text"
          value={detail.detailNm}
          onChange={(e) => onChange('detailNm', e.target.value)}
          className="flex-1 rounded border p-2"
        />
      </div>

      {/* 상세 품목 */}
      <div className="flex w-full items-center">
        <div className="!w-[100px]">
          상세 품목<span className="text-[red]">*</span>
        </div>
        <textarea
          value={detail.detail}
          onChange={(e) => onChange('detail', e.target.value)}
          className="w-[213px] flex-1 rounded border p-2"
        />
      </div>

      {/* 추가 문구 */}
      <div className="flex w-full items-center">
        <div className="!w-[100px]">추가 문구</div>
        <textarea
          value={detail.addDetail}
          onChange={(e) => onChange('addDetail', e.target.value)}
          className="w-[213px] flex-1 rounded border p-2"
        />
      </div>

      {/* 배송일 */}
      <div className="flex w-full">
        <div className="!w-[100px]">배송 일</div>
        <div className="flex-1">
          <DatePicker
            selected={null}
            onChange={(date) => addDate(date)}
            dateFormat="yyyy/MM/dd"
            className="w-[120px] cursor-pointer rounded-md border p-2"
          />
          <div className="text-sm">(중복 선택 가능)</div>

          <div className="inline-block">
            {detail.dateList.map((d) => (
              <span
                key={d}
                className="m-[3px] inline-flex items-center gap-1 rounded-full bg-[#2FCBC0] px-3 py-1 text-sm text-white"
              >
                {d}
                <button type="button" onClick={() => removeDate(d)} className="hover:text-red-200">
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 이미지 */}
      <div className="flex w-full items-start gap-4">
        <div className="!w-[100px]">
          이미지<span className="text-[red]">*</span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (!file) return;
              onChange('imageFile', file);
              const previewUrl = URL.createObjectURL(file);
              onChange('previewUrl', previewUrl);
            }}
          />
          {detail.previewUrl && (
            <img src={detail.previewUrl} className="mt-2 rounded border" alt="preview" />
          )}
        </div>
      </div>

      {/* 대체 상품 */}
      <div className="flex w-full">
        <div className="!w-[100px]">대체상품</div>
        <div className="flex-1">
          <select
            className="w-[100px] rounded border p-2"
            value={detail.isReplaceable ? 'Y' : 'N'}
            onChange={(e) => onChange('isReplaceable', e.target.value === 'Y')}
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>

          {detail.isReplaceable && (
            <div className="mt-2 flex flex-col rounded-md border bg-white p-2">
              <div>
                선택 (중복)
                <span className="text-red-500">*</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDetails
                  .filter((d) => d.id !== detail.id)
                  .map((opt) => {
                    const selected = detail.replaceIds.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`rounded border px-2 py-1 text-sm ${
                          selected ? 'bg-[#2FCBC0] text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => {
                          onChange(
                            'replaceIds',
                            selected
                              ? detail.replaceIds.filter((p) => p !== opt.id)
                              : [...detail.replaceIds, opt.id]
                          );
                        }}
                      >
                        {opt.detailNm || `상품 ${opt.id}`}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 주소 선택 */}
      <div className="flex w-full">
        <div className="!w-[100px]">업체주소</div>
        <div className="flex-1">
          <select
            className="w-[100px] rounded border p-2"
            value={detail.isStoreInfo ? 'Y' : 'N'}
            onChange={(e) => onChange('isStoreInfo', e.target.value === 'Y')}
          >
            <option value="N">N</option>
            <option value="Y">Y</option>
          </select>

          {detail.isStoreInfo && (
            <div className="mt-2">
              <label className="cursor-pointer text-blue-600 underline">
                <a href="/sample.xlsx" download>
                  엑셀 양식 다운로드
                </a>
              </label>

              <input
                type="file"
                accept=".xlsx,.xls"
                className="mt-2"
                onChange={(e) => {
                  if (!e.target.files?.[0]) return;
                  handleExcelUpload(e.target.files[0]);
                }}
              />

              <div className="mt-2 text-sm">
                {detail.storeInfos.length > 0 ? (
                  `총 ${detail.storeInfos.length}개 업로드됨`
                ) : (
                  <span className="text-red-500">주소록 업로드 필요</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 버튼 */}
      {detail.id !== 0 && (
        <div className="w-full text-right">
          <Button
            label="삭제"
            onClick={onRemove}
            className="w-[80px] bg-red-600 text-white hover:bg-red-700"
          />
        </div>
      )}
    </div>
  );
};

export default GiftDetailCard;
