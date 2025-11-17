import { NextResponse } from 'next/server'
import { connectDB, db } from '@/lib/db'

export async function GET() {
  try {
    await connectDB()

    // Find earnings that are 10 days old and still pending
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

    const result = await db.collection('earnings').updateMany(
      {
        status: 'pending',
        created_at: { $lte: tenDaysAgo }
      },
      {
        $set: {
          status: 'paid',
          paid_at: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: `Settled ${result.modifiedCount} earnings`,
      count: result.modifiedCount
    })
  } catch (error) {
    console.error('[v0] Error settling earnings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
