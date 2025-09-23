export interface StoreInfo {
  seq: number;
  region: string;
  address: string;
}

export interface ProductDetailInput {
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

export interface ProductInput {
  productNm: string;
  startDate: string;
  endDate: string;
  deliveryDate: string;
  deliveryDt: string;
}

export async function createGift(params: {
  product: ProductInput;
  details: ProductDetailInput[];
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
    replaceId: d.replaceId,
    isStoreInfo: d.isStoreInfo,
    storeInfos: d.storeInfos,
  }));

  fd.append('product', JSON.stringify(product));
  fd.append('details', JSON.stringify(detailsMeta));

  // 파일은 인덱스로 맞춰 보냄: detailImage_0, detailImage_1, ...
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
