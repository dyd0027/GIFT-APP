import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { phone, name } = await req.json();
    const purePhone = phone.replace(/[^0-9]/g, '');

    const exists = await prisma.p2021_user_m.findUnique({
      where: { LOGIN_ID: purePhone, LOGIN_NM: name },
    });

    if (!exists) {
      return NextResponse.json({ message: '존재하지 않는 계정입니다.' }, { status: 409 });
    }

    await prisma.p2021_user_m.delete({
      where: {
        LOGIN_ID: purePhone,
        LOGIN_NM: name,
      },
    });

    return NextResponse.json({ message: '등록 성공' });
  } catch (err: any) {
    return NextResponse.json({ message: '서버 오류', error: err.message }, { status: 500 });
  }
}
