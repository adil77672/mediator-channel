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

    const earnings = await db
      .collection('earnings')
      .find({ uploader_id: payload.userId })
      .sort({ created_at: -1 })
      .limit(100)
      .toArray()

    const pending = earnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)
    const paid = earnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)

    return NextResponse.json({
      earnings,
      totals: {
        pending: pending.toFixed(2),
        paid: paid.toFixed(2),
        total: (pending + paid).toFixed(2)
      }
    })
  } catch (error) {
    console.error('[earnings] Error fetching earnings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

