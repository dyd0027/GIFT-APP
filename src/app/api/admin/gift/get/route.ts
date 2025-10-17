// /app/api/get/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product_m.findMany({
      orderBy: { SEQ: 'desc' },
    });
    const camelCased = products.map((p) => ({
      seq: p.SEQ,
      productNm: p.PRODUCT_NM,
      productDate: p.PRODUCT_DATE,
      startDate: p.PRODUCT_STDT,
      endDate: p.PRODUCT_EDDT,
      notice: p.NOTICE,
    }));
    return NextResponse.json({ ok: true, data: camelCased }, { status: 200 });
  } catch (error: any) {
    console.error('GET product_m error:', error);
    return NextResponse.json(
      { ok: false, message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
