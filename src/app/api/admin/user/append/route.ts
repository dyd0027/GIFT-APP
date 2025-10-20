import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { users } = await req.json();
    if (!Array.isArray(users)) {
      return NextResponse.json({ message: '잘못된 데이터 형식입니다.' }, { status: 400 });
    }

    const data = users.map((user: any) => ({
      login_id: user.phone,
      login_nm: user.name,
      comp_nm: user.company ?? '',
      hq_nm: user.hq ?? '',
      dept_nm: user.dept ?? '',
    }));

    await prisma.user_m.createMany({ data, skipDuplicates: true });

    return NextResponse.json({ message: '추가 업로드 성공' });
  } catch (err: any) {
    return NextResponse.json({ message: '서버 오류', error: err.message }, { status: 500 });
  }
}
