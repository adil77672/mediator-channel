import { NextRequest, NextResponse } from 'next/server'
import { connectDB, db } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const payload = await verifyAuthToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const uploads = await db
      .collection('group_uploaded')
      .find({ uploader_id: payload.userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ uploads })
  } catch (error) {
    console.error('[uploads] error listing uploads', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

