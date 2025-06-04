import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      maxAge: 0, // 만료시간 0으로
      path: '/',
      sameSite: 'lax',
    })
  );
  return res;
}
