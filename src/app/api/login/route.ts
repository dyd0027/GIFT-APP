import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 이건 아래에 따로 설명
import type { NextRequest } from 'next/server';
import { createToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const { LOGIN_ID, LOGIN_NM } = await req.json();

    const user = await prisma.p2021_user_m.findUnique({
      where: { LOGIN_ID,LOGIN_NM },
    });

    if (!user) {
      return NextResponse.json({ success: false });
    }

    const token = createToken({ LOGIN_ID });
    console.log('user????',user);
    const res = NextResponse.json({ success: true, user });
    res.headers.set(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      })
    );
    return res;
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
