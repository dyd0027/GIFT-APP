import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { phone, name, company, hq, dept } = await req.json();
    const purePhone = phone.replace(/[^0-9]/g, '');
    if (!purePhone || !name) {
      return NextResponse.json({ message: '전화번호와 이름은 필수입니다.' }, { status: 400 });
    }

    const exists = await prisma.user_m.findUnique({ where: { LOGIN_ID: purePhone } });

    if (exists) {
      return NextResponse.json({ message: '이미 존재하는 전화번호입니다.' }, { status: 409 });
    }

    await prisma.user_m.create({
      data: {
        LOGIN_ID: purePhone,
        LOGIN_NM: name,
        COMP_NM: company || null,
        HQ_NM: hq || null,
        DEPT_NM: dept || null,
      },
    });

    return NextResponse.json({ message: '등록 성공' });
  } catch (err: any) {
    return NextResponse.json({ message: '서버 오류', error: err.message }, { status: 500 });
  }
}
