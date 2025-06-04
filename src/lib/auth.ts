import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export const createToken = (payload: object) =>
    jwt.sign(payload, secret, { expiresIn: '7d' });

export const verifyToken = (token: string) => 
    jwt.verify(token, secret);
  