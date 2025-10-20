// /app/api/get/giftList/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function get(req: NextRequest) {
  try {
    const gifts = await prisma.gift_m.findMany({
      orderBy: { seq: 'desc' },
    });
    const camelCased = gifts.map((p) => ({
      seq: p.seq,
      giftNm: p.gift_nm,
      giftDate: p.gift_date,
      startDate: p.gift_stdt,
      endDate: p.gift_eddt,
      notice: p.notice,
    }));
    return NextResponse.json({ ok: true, data: camelCased }, { status: 200 });
  } catch (error: any) {
    console.error('GET gift_m error:', error);
    return NextResponse.json(
      { ok: false, message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
