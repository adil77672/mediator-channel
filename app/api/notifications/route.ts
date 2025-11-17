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

    const notifications = await db
      .collection('notifications')
      .find({ temp_id: payload.userId })
      .sort({ timestamp: -1 })
      .limit(25)
      .toArray()

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('[notifications] Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

