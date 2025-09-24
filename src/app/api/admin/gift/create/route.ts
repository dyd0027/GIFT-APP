// /app/api/create/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProductPayload = {
  productNm: string;
  productDate: string;
  startDate: string; // ISO
  endDate: string; // ISO
  deliveryDt: string; // 안내문 (VARCHAR(5000))
};

type StoreInfo = {
  // 지금 스키마엔 seq 컬럼이 없으므로 제외
  region: string | null | undefined;
  address: string | null | undefined;
};

type DetailMeta = {
  id: number;
  detailNm: string;
  detail: string;
  addDetail: string;
  subSort: number;
  dateList: string[]; // ["YYYYMMDD", ...] 콤마로 직렬화
  isReplaceable: boolean;
  replaceId: number | null;
  isStoreInfo: boolean;
  storeInfos: StoreInfo[];
};

// 유틸: ISO -> yyyymmddHHMMSS (시작/끝 경계 포함)
function toYYYYMMDDHHMMSS(iso: string, endOfDay = false) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${endOfDay ? '235959' : '000000'}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const productStr = form.get('product');
    const detailsStr = form.get('details');
    if (typeof productStr !== 'string' || typeof detailsStr !== 'string') {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    const product = JSON.parse(productStr) as ProductPayload;
    const details = JSON.parse(detailsStr) as DetailMeta[];
    if (!product.productNm || !product.startDate || !product.endDate || !product.deliveryDt) {
      return NextResponse.json(
        { ok: false, message: 'Missing required product fields' },
        { status: 400 }
      );
    }
    if (!Array.isArray(details) || details.length === 0) {
      return NextResponse.json({ ok: false, message: 'Details is empty' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gift');
    await mkdir(uploadDir, { recursive: true });

    const PRODUCT_STDT = toYYYYMMDDHHMMSS(product.startDate, false);
    const PRODUCT_EDDT = toYYYYMMDDHHMMSS(product.endDate, true);
    const DELIVERY_DT = product.deliveryDt;
    const tempDate = new Date(product.productDate);
    const productDate =
      tempDate.getFullYear() + '년' + String(tempDate.getMonth() + 1).padStart(2, '0') + '월';

    const result = await prisma.$transaction(async (tx) => {
      // 1) product_m 생성
      const createdProduct = await tx.product_m.create({
        data: {
          PRODUCT_NM: product.productNm,
          PRODUCT_DATE: productDate,
          PRODUCT_STDT,
          PRODUCT_EDDT,
          DELIVERY_DT: DELIVERY_DT,
        },
      });
      const productSeq = createdProduct.SEQ; // INT

      // product_sub 생성 (이미지 경로는 나중에 업데이트)
      const createdSubs: { index: number; clientId: number; subId: number }[] = [];

      for (let i = 0; i < details.length; i++) {
        const d = details[i];
        const sub = await tx.product_sub.create({
          data: {
            product_seq: productSeq,
            detailNm: d.detailNm,
            detail: d.detail || null,
            imageFile: null, // 파일 저장 후 업데이트
            sub_sort: Number.isFinite(d.subSort as any) ? d.subSort : i,
            date_list: d.dateList?.length ? d.dateList.join(',') : null,
            replace_id: null,
            add_detail: d.addDetail || null,
          },
        });
        createdSubs.push({ index: i, clientId: d.id, subId: sub.id });
      }

      // replaceId 설정
      const idMap = new Map<number, number>();
      createdSubs.forEach(({ clientId, subId }) => idMap.set(clientId, subId));

      for (const { index, subId } of createdSubs) {
        const d = details[index];
        if (d.isReplaceable && d.replaceId != null) {
          const targetSubId = idMap.get(d.replaceId);
          // 방어: 타겟이 없거나 자기 자신이면 스킵
          if (!targetSubId || targetSubId === subId) continue;
          await tx.product_sub.update({
            where: { id: subId },
            data: { replace_id: targetSubId },
          });
        }
      }

      // 이미지 저장 + product_sub.imageFile 업데이트
      for (const { index, subId } of createdSubs) {
        const file = form.get(`detailImage_${index}`);
        if (file && file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // 확장자 얻기
          const origName = (file as File).name || 'file';
          const dotIdx = origName.lastIndexOf('.');
          const ext = dotIdx >= 0 ? origName.slice(dotIdx) : '.bin';

          const fileName = `${productSeq}_${subId}${ext}`;
          const abs = path.join(uploadDir, fileName);
          await writeFile(abs, buffer);

          const publicPath = `/uploads/gift/${fileName}`;
          await tx.product_sub.update({
            where: { id: subId },
            data: { imageFile: publicPath },
          });
        }
      }

      // choice_store 다건 insert
      for (const { index, subId } of createdSubs) {
        const d = details[index];
        if (d.isStoreInfo && d.storeInfos?.length) {
          await tx.choice_store.createMany({
            data: d.storeInfos.map((s) => ({
              product_sub_id: subId,
              region: s?.region ?? null,
              address: s?.address ?? null,
            })),
          });
        }
      }

      return { productSeq, countSubs: createdSubs.length };
    });

    return NextResponse.json({ ok: true, data: result }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}
