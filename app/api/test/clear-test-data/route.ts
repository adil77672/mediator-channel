import { NextRequest, NextResponse } from 'next/server'
import { connectDB, db } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const payload = await verifyAuthToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const regex = new RegExp(`^TEST${payload.userId.slice(-6).toUpperCase()}`)

    // Clear test data
    await db.collection('user_deposit').deleteMany({ group_id: regex })
    await db.collection('earnings').deleteMany({ group_id: regex, uploader_id: payload.userId })
    await db.collection('notifications').deleteMany({ temp_id: payload.userId, message: /^Payment received/ })
    await db.collection('group_uploaded').deleteMany({ group_id: regex, uploader_id: payload.userId })

    return NextResponse.json({
      success: true,
      message: 'Test data cleared successfully'
    })
  } catch (error) {
    console.error('[v0] Error clearing test data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
