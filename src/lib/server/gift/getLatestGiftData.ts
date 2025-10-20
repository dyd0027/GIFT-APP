// src/lib/server/gift/getLatestGiftData.ts
import { PrismaClient } from '@prisma/client';
import { isoFromYYYYMMDDHHMMSS, toFirstDayISOFromLabel } from '@/utils/date';

export async function getLatestGiftData() {
  const prisma = new PrismaClient();

  try {
    const latest = await prisma.gift_m.findFirst({
      orderBy: { seq: 'desc' },
      include: {
        gift_sub: {
          include: { choice_store: true },
        },
      },
    });

    if (!latest) return null;

    const initialGift = {
      giftNm: latest.gift_nm,
      startDate: isoFromYYYYMMDDHHMMSS(latest.gift_stdt),
      endDate: isoFromYYYYMMDDHHMMSS(latest.gift_eddt),
      giftDate: toFirstDayISOFromLabel(latest.gift_date ?? ''),
      notice: latest.notice ?? '',
    };

    const initialDetails = latest.gift_sub.map((s) => ({
      id: s.id,
      detailNm: s.detailNm,
      detail: s.detail ?? '',
      addDetail: s.add_detail ?? '',
      imageFile: null,
      previewUrl: s.imageFile ?? null,
      subSort: s.sub_sort ?? 0,
      dateList: s.date_list ? s.date_list.split(',').filter(Boolean) : [],
      isReplaceable: Boolean(s.replace_ids && s.replace_ids.length),
      replaceIds: s.replace_ids ? s.replace_ids.split(',').map(Number) : [],
      isStoreInfo: (s.choice_store?.length ?? 0) > 0,
      storeInfos: (s.choice_store || []).map((c) => ({
        seq: c.seq ?? 0,
        region: c.region ?? '',
        address: c.address ?? '',
        tel: c.tel ?? '',
      })),
    }));

    return {
      giftSeq: latest.seq,
      initialGift,
      initialDetails,
    };
  } catch (error) {
    console.error('getLatestGiftData error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
