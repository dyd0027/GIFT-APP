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

    const giftSeqStr = form.get('giftSeq');
    const giftStr = form.get('gift');
    const detailsStr = form.get('details');

    if (typeof giftSeqStr !== 'string' || !/^\d+$/.test(giftSeqStr)) {
      return NextResponse.json({ ok: false, message: 'Invalid giftSeq' }, { status: 400 });
    }
    if (typeof giftStr !== 'string' || typeof detailsStr !== 'string') {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    const giftSeq = Number(giftSeqStr);
    const gift = JSON.parse(giftStr) as Gift;
    const details = JSON.parse(detailsStr) as (Omit<GiftDetail, 'imageFile' | 'previewUrl'> & {
      imageFile?: never;
      previewUrl?: never;
    })[];

    if (!gift.giftNm || !gift.startDate || !gift.endDate || !gift.notice) {
      return NextResponse.json(
        { ok: false, message: 'Missing required gift fields' },
        { status: 400 }
      );
    }

    // 저장 폴더(public 하위)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gift');
    await mkdir(uploadDir, { recursive: true });

    const gift_stdt = toYYYYMMDDHHMMSS(gift.startDate, false);
    const gift_eddt = toYYYYMMDDHHMMSS(gift.endDate, true);
    const tmpDate = new Date(gift.giftDate);
    const giftDate = `${tmpDate.getFullYear()}년${String(tmpDate.getMonth() + 1).padStart(2, '0')}월`;

    const result = await prisma.$transaction(async (tx) => {
      // 0) gift 존재 확인
      const exists = await tx.gift_m.findUnique({ where: { seq: giftSeq } });
      if (!exists) {
        throw new Error(`gift_m not found: ${giftSeq}`);
      }

      // 1) gift_m 업데이트
      await tx.gift_m.update({
        where: { seq: giftSeq },
        data: {
          gift_nm: gift.giftNm,
          gift_date: giftDate,
          gift_stdt,
          gift_eddt,
          notice: gift.notice,
        },
      });

      // 2) 기존 sub 리스트
      const existingSubs = await tx.gift_sub.findMany({
        where: { gift_seq: giftSeq },
        select: { id: true },
      });
      const existingIds = new Set(existingSubs.map((s) => s.id));

      // 3) 생성/업데이트 (replace_ids, image는 나중에)
      //    clientId -> subId 매핑 (기존 것은 그대로, 새로 만든 것은 새 id)
      const createdOrUpdated: { index: number; clientId: number; subId: number }[] = [];

      for (let i = 0; i < details.length; i++) {
        const d = details[i];
        const isExisting = existingIds.has(d.id);

        if (isExisting) {
          // UPDATE
          await tx.gift_sub.update({
            where: { id: d.id },
            data: {
              detailNm: d.detailNm,
              detail: d.detail || null,
              sub_sort: Number.isFinite(d.subSort as any) ? d.subSort : i,
              date_list: d.dateList?.length ? d.dateList.join(',') : null,
              // replace_ids는 이후 일괄 업데이트
              add_detail: d.addDetail || null,
            },
          });
          createdOrUpdated.push({ index: i, clientId: d.id, subId: d.id });
        } else {
          // CREATE
          const sub = await tx.gift_sub.create({
            data: {
              gift_seq: giftSeq,
              detailNm: d.detailNm,
              detail: d.detail || null,
              imageFile: null,
              sub_sort: Number.isFinite(d.subSort as any) ? d.subSort : i,
              date_list: d.dateList?.length ? d.dateList.join(',') : null,
              replace_ids: null,
              add_detail: d.addDetail || null,
            },
          });
          createdOrUpdated.push({ index: i, clientId: d.id, subId: sub.id });
        }
      }

      // 4) 삭제: 클라이언트 목록에 없는 기존 sub는 제거
      const clientIdsSet = new Set(details.map((d) => d.id));
      const idsToDelete = [...existingIds].filter((id) => !clientIdsSet.has(id));
      if (idsToDelete.length > 0) {
        await tx.gift_sub.deleteMany({
          where: { id: { in: idsToDelete } },
        });
      }

      // 5) 이미지: 파일이 올라온 것만 덮어쓰기 + URL 업데이트
      for (const { index, subId } of createdOrUpdated) {
        const file = form.get(`detailImage_${index}`);
        if (file && file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const origName = (file as File).name || 'file';
          const dotIdx = origName.lastIndexOf('.');
          const ext = dotIdx >= 0 ? origName.slice(dotIdx) : '.bin';
          const fileName = `${giftSeq}_${subId}${ext}`;
          const abs = path.join(uploadDir, fileName);
          await writeFile(abs, buffer); // 덮어쓰기

          const publicPath = `/uploads/gift/${fileName}`;
          await tx.gift_sub.update({
            where: { id: subId },
            data: { imageFile: publicPath },
          });
        }
      }

      // 6) replace_ids 업데이트 (clientId -> subId 맵으로 변환)
      const idMap = new Map<number, number>();
      createdOrUpdated.forEach(({ clientId, subId }) => idMap.set(clientId, subId));

      for (const { index, subId } of createdOrUpdated) {
        const d = details[index];
        const list = Array.isArray(d.replaceIds) ? d.replaceIds : [];
        const mapped = list
          .map((cid) => idMap.get(cid))
          .filter((v): v is number => !!v && v !== subId);
        const csv = Array.from(new Set(mapped)).join(',') || null;

        await tx.gift_sub.update({
          where: { id: subId },
          data: { replace_ids: csv },
        });
      }

      // 7) choice_store 재구성: 각 sub별로 싹 지우고 다시 삽입
      for (const { index, subId } of createdOrUpdated) {
        const d = details[index];
        // 지우기
        await tx.choice_store.deleteMany({ where: { gift_sub_id: subId } });
        // 다시 삽입
        if (d.isStoreInfo && d.storeInfos?.length) {
          await tx.choice_store.createMany({
            data: d.storeInfos.map((s) => ({
              gift_sub_id: subId,
              seq: s?.seq ?? null,
              region: s?.region ?? null,
              address: s?.address ?? null,
              tel: (s as any)?.tel ?? null, // 타입에 tel 있으면 사용
            })),
            skipDuplicates: true,
          });
        }
      }

      return {
        giftSeq,
        updated: true,
        subCount: createdOrUpdated.length,
        deletedSubs: idsToDelete.length,
      };
    });

    return NextResponse.json({ ok: true, data: result }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, message: e?.message || 'Server error' }, { status: 500 });
  }
}
