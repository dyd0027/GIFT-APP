import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serialize } from 'cookie';

import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { LOGIN_ID, LOGIN_NM } = await req.json();

    const user = await prisma.user_m.findUnique({
      where: { LOGIN_ID, LOGIN_NM },
    });

    if (!user) {
      return NextResponse.json({ success: false });
    }

    const token = createToken({ LOGIN_ID });
    console.log('user????', user);
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
