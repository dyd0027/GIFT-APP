import { Product } from '@/types/Product';
import { ProductDetail } from '@/types/ProductDetail';

export async function createGift(params: {
  product: Product;
  details: ProductDetail[];
}): Promise<{ ok: boolean; message?: string; data?: any }> {
  const { product, details } = params;
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
  fd.append('product', JSON.stringify(product));
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
export async function updateGift(params: {
  productSeq: number;
  product: Product;
  details: ProductDetail[];
}): Promise<{ ok: boolean; message?: string; data?: any }> {
  const { productSeq, product, details } = params;
  const fd = new FormData();

  const detailsMeta = details.map((d) => ({
    id: d.id, // modify에선 기존 DB PK가 올 수도 있고, 새로 추가된 임시 id일 수도 있음
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

  fd.append('productSeq', String(productSeq));
  fd.append('product', JSON.stringify(product));
  fd.append('details', JSON.stringify(detailsMeta));

  details.forEach((d, i) => {
    if (d.imageFile) {
      fd.append(`detailImage_${i}`, d.imageFile, d.imageFile.name);
    }
  });

  const res = await fetch('/api/admin/gift/modify', {
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
