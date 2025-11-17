import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export const AUTH_COOKIE_NAME = 'mc_session'
const JWT_SECRET = process.env.AUTH_SECRET || 'mediator-channel-dev-secret'
const JWT_EXPIRY = '7d'
const secretKey = new TextEncoder().encode(JWT_SECRET)

type TokenPayload = {
  userId: string
  role: 'intermediary' | 'admin' | 'mediator' | 'viewer'
  email: string
}

export function createAuthToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRY)
    .sign(secretKey)
}

export async function verifyAuthToken(token?: string): Promise<(TokenPayload & { iat: number; exp: number }) | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as TokenPayload & { iat: number; exp: number }
  } catch (error) {
    console.warn('[auth] Invalid token', error)
    return null
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

