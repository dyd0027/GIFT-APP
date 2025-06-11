import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { users } = await req.json();
    if (!Array.isArray(users)) {
      return NextResponse.json({ message: '잘못된 데이터 형식입니다.' }, { status: 400 });
    }

    const errors: string[] = [];

    const ADMIN_ID = 'sangsangin';

    const result = await prisma.$transaction(async (tx) => {
      await tx.p2021_user_m.deleteMany({ where: { NOT: { LOGIN_ID: ADMIN_ID } } });

      const insertData = users.map((item, idx) => {
        const phone = String(item.phone ?? '').trim();
        const name = String(item.name ?? '').trim();
        const comp = String(item.company ?? '').trim();
        const hq = String(item.hq ?? '').trim();
        const dept = String(item.dept ?? '').trim();

        if (!phone || !name) {
          errors.push(`[${idx + 2}행] 전화번호 또는 이름이 비어있습니다.`);
        }

        if (!/^\d{10,11}$/.test(phone)) {
          errors.push(`[${idx + 2}행] 전화번호 형식이 올바르지 않습니다.`);
        }

        return {
          LOGIN_ID: phone,
          LOGIN_NM: name,
          COMP_NM: comp,
          HQ_NM: hq,
          DEPT_NM: dept,
        };
      });

      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      await tx.p2021_user_m.createMany({ data: insertData });
    });

    return NextResponse.json({ message: '업로드 성공' });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ message: '업로드 실패', error: err.message }, { status: 500 });
  }
}
