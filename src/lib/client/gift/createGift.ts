import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';

export async function createGift(params: {
  gift: Gift;
  details: GiftDetail[];
}): Promise<{ ok: boolean; message?: string; data?: any }> {
  const { gift, details } = params;
  const fd = new FormData();

  // 파일을 제외한 detail 메타데이터
  const detailsMeta = details.map((d) => ({
    id: d.id,
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
  fd.append('gift', JSON.stringify(gift));
  fd.append('details', JSON.stringify(detailsMeta));

  details.forEach((d, i) => {
    if (d.imageFile) {
      fd.append(`detailImage_${i}`, d.imageFile, d.imageFile.name);
    }
  });

  const res = await fetch('/api/admin/gift/create', {
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
