import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';

export async function updateGift(params: {
  giftSeq: number;
  gift: Gift;
  details: GiftDetail[];
}): Promise<{ ok: boolean; message?: string; data?: any }> {
  const { giftSeq, gift, details } = params;
  const fd = new FormData();

  const detailsMeta = details.map((d) => ({
    id: d.id, // update에선 기존 DB PK가 올 수도 있고, 새로 추가된 임시 id일 수도 있음
    detailNm: d.detailNm,
    detail: d.detail,
    addDetail: d.addDetail,
    subSort: d.subSort,
    dateList: d.dateList,
    isReplaceable: d.isReplaceable,
    replaceIds: d.replaceIds,
    isStoreInfo: d.isStoreInfo,
    storeInfos: d.storeInfos,
  }));

  fd.append('giftSeq', String(giftSeq));
  fd.append('gift', JSON.stringify(gift));
  fd.append('details', JSON.stringify(detailsMeta));

  details.forEach((d, i) => {
    if (d.imageFile) {
      fd.append(`detailImage_${i}`, d.imageFile, d.imageFile.name);
    }
  });

  const res = await fetch('/api/admin/gift/update', {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    return { ok: false, message: txt || 'Request failed' };
  }
  const json = await res.json().catch(() => ({}));
  return { ok: true, data: json };
}
