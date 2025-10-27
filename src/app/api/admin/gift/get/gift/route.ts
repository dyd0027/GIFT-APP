import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { isoFromYYYYMMDDHHMMSS, toFirstDayISOFromLabel } from '@/utils/date';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seq = Number(searchParams.get('seq'));

  if (!seq) {
    return NextResponse.json({ ok: false, message: 'seq 파라미터가 없습니다.' }, { status: 400 });
  }

  const gift = await prisma.gift_m.findFirst({
    where: { seq },
    include: {
      gift_sub: {
        include: { choice_store: true },
      },
    },
  });

  if (!gift) {
    return NextResponse.json(
      { ok: false, message: '해당 선물이 존재하지 않습니다.' },
      { status: 404 }
    );
  }

  const initialGift = {
    giftNm: gift.gift_nm,
    startDate: isoFromYYYYMMDDHHMMSS(gift.gift_stdt),
    endDate: isoFromYYYYMMDDHHMMSS(gift.gift_eddt),
    giftDate: toFirstDayISOFromLabel(gift.gift_date ?? ''),
    notice: gift.notice ?? '',
  };

  const initialDetails = gift.gift_sub.map((s) => ({
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

  return NextResponse.json(
    {
      ok: true,
      data: {
        giftSeq: gift.seq,
        initialGift,
        initialDetails,
      },
    },
    { status: 200 }
  );
}
