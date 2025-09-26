import { PrismaClient } from '@prisma/client';
import GiftForm from '@/components/admin/gift/GiftForm';

// 서버 컴포넌트
export default async function ModifyGiftPage() {
  const prisma = new PrismaClient();

  // 가장 id(SEQ)가 큰 product_m
  const latest = await prisma.product_m.findFirst({
    orderBy: { SEQ: 'desc' },
    include: {
      product_sub: {
        include: { choice_store: true },
      },
    },
  });

  if (!latest) {
    return <div className="p-6">데이터가 없습니다.</div>;
  }

  // DB → UI 타입으로 매핑
  const initialProduct = {
    productNm: latest.PRODUCT_NM,
    startDate: isoFromYYYYMMDDHHMMSS(latest.PRODUCT_STDT),
    endDate: isoFromYYYYMMDDHHMMSS(latest.PRODUCT_EDDT),
    productDate: toFirstDayISOFromLabel(latest.PRODUCT_DATE ?? ''),
    notice: latest.NOTICE ?? '',
  };

  const initialDetails = latest.product_sub.map((s) => ({
    id: s.id,
    detailNm: s.detailNm,
    detail: s.detail ?? '',
    addDetail: s.add_detail ?? '',
    imageFile: null,
    previewUrl: s.imageFile ?? null,
    subSort: s.sub_sort ?? 0,
    dateList: s.date_list ? s.date_list.split(',').filter(Boolean) : [],
    isReplaceable: Boolean(s.replace_ids && s.replace_ids.length),
    replaceIds: s.replace_ids ? s.replace_ids.split(',').map((n) => Number(n)) : [],
    isStoreInfo: (s.choice_store?.length ?? 0) > 0,
    storeInfos: (s.choice_store || []).map((c) => ({
      seq: c.seq ?? 0,
      region: c.region ?? '',
      address: c.address ?? '',
      tel: c.tel ?? '',
    })),
  }));

  return (
    <GiftForm
      productSeq={latest.SEQ}
      initialProduct={initialProduct}
      initialDetails={initialDetails}
    />
  );
}

// 유틸: yyyymmddHHMMSS -> ISO
function isoFromYYYYMMDDHHMMSS(s?: string | null) {
  if (!s || s.length < 8) return '';
  const yyyy = Number(s.slice(0, 4));
  const mm = Number(s.slice(4, 6)) - 1;
  const dd = Number(s.slice(6, 8));
  const HH = Number(s.slice(8, 10) || '0');
  const MM = Number(s.slice(10, 12) || '0');
  const SS = Number(s.slice(12, 14) || '0');
  const d = new Date(yyyy, mm, dd, HH, MM, SS);
  return d.toISOString();
}

// 예: "2024년05월" -> "2024-05-01T00:00:00.000Z" (필요 시 로직 조정)
function toFirstDayISOFromLabel(label: string) {
  const m = label.match(/(\d{4})년(\d{2})월/);
  if (!m) return '';
  const yyyy = Number(m[1]);
  const mm = Number(m[2]) - 1;
  return new Date(yyyy, mm, 1).toISOString();
}
