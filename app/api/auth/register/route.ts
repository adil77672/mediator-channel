import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { connectDB, db } from '@/lib/db'
import { AUTH_COOKIE_NAME, createAuthToken, hashPassword } from '@/lib/auth'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2).max(50),
  role: z.enum(['intermediary', 'mediator', 'admin']).default('intermediary')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: 400 }
      )
    }

    const { email, password, name, role } = parsed.data
    await connectDB()

    const existing = await db.collection('users').findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const { insertedId } = await db.collection('users').insertOne({
      email,
      password: passwordHash,
      name,
      role,
      created_at: new Date()
    })

    const token = await createAuthToken({
      userId: insertedId.toString(),
      role,
      email
    })

    const response = NextResponse.json({
      user: {
        id: insertedId.toString(),
        email,
        name,
        role
      }
    })

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('[auth] register error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

