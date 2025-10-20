// /app/api/create/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Gift } from '@/types/Gift';
import { GiftDetail } from '@/types/GiftDetail';

const prisma = new PrismaClient();

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

    const giftStr = form.get('gift');
    const detailsStr = form.get('details');
    if (typeof giftStr !== 'string' || typeof detailsStr !== 'string') {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    const gift = JSON.parse(giftStr) as Gift;
    const details = JSON.parse(detailsStr) as GiftDetail[];
    if (!gift.giftNm || !gift.startDate || !gift.endDate || !gift.notice) {
      return NextResponse.json(
        { ok: false, message: 'Missing required gift fields' },
        { status: 400 }
      );
    }
    if (!Array.isArray(details) || details.length === 0) {
      return NextResponse.json({ ok: false, message: 'Details is empty' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gift');
    await mkdir(uploadDir, { recursive: true });

    const gift_stdt = toYYYYMMDDHHMMSS(gift.startDate, false);
    const gift_eddt = toYYYYMMDDHHMMSS(gift.endDate, true);
    const tempDate = new Date(gift.giftDate);
    const giftDate =
      tempDate.getFullYear() + '년' + String(tempDate.getMonth() + 1).padStart(2, '0') + '월';

    const result = await prisma.$transaction(async (tx) => {
      // 1) gift_m 생성
      const createdGift = await tx.gift_m.create({
        data: {
          gift_nm: gift.giftNm,
          gift_date: giftDate,
          gift_stdt,
          gift_eddt,
          notice: gift.notice,
        },
      });
      const giftSeq = createdGift.seq; // INT

      // gift_sub 생성 (이미지 경로는 나중에 업데이트)
      const createdSubs: { index: number; clientId: number; subId: number }[] = [];

      for (let i = 0; i < details.length; i++) {
        const d = details[i];
        const sub = await tx.gift_sub.create({
          data: {
            gift_seq: giftSeq,
            detailNm: d.detailNm,
            detail: d.detail || null,
            imageFile: null, // 파일 저장 후 업데이트
            sub_sort: Number.isFinite(d.subSort as any) ? d.subSort : i,
            date_list: d.dateList?.length ? d.dateList.join(',') : null,
            replace_ids: null,
            add_detail: d.addDetail || null,
          },
        });
        createdSubs.push({ index: i, clientId: d.id, subId: sub.id });
      }

      // replaceIds 설정
      const idMap = new Map<number, number>();
      createdSubs.forEach(({ clientId, subId }) => idMap.set(clientId, subId));

      for (const { index, subId } of createdSubs) {
        const d = details[index];
        if (d.isReplaceable && Array.isArray(d.replaceIds) && d.replaceIds.length) {
          // 임시 id 배열 -> 실제 subId 배열
          const mapped = d.replaceIds
            .map((cid) => idMap.get(cid))
            .filter((v): v is number => !!v && v !== subId); // 자기 자신 제외

          const unique = Array.from(new Set(mapped));
          const csv = unique.join(',');

          await tx.gift_sub.update({
            where: { id: subId },
            data: { replace_ids: csv },
          });
        }
      }

      // 이미지 저장 + gift_sub.imageFile 업데이트
      for (const { index, subId } of createdSubs) {
        const file = form.get(`detailImage_${index}`);
        if (file && file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // 확장자 얻기
          const origName = (file as File).name || 'file';
          const dotIdx = origName.lastIndexOf('.');
          const ext = dotIdx >= 0 ? origName.slice(dotIdx) : '.bin';

          const fileName = `${giftSeq}_${subId}${ext}`;
          const abs = path.join(uploadDir, fileName);
          await writeFile(abs, buffer);

          const publicPath = `/uploads/gift/${fileName}`;
          await tx.gift_sub.update({
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
              gift_sub_id: subId,
              seq: s?.seq ?? null,
              region: s?.region ?? null,
              address: s?.address ?? null,
              tel: s?.tel ?? null,
            })),
          });
        }
      }

      return { giftSeq, countSubs: createdSubs.length };
    });

    return NextResponse.json({ ok: true, data: result }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}
