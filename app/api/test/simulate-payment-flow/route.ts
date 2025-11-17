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

    const body = await request.json()
    const defaultGroupId = `TEST${payload.userId.slice(-6).toUpperCase()}`
    const { numUsers = 100, groupId = defaultGroupId } = body

    await connectDB()

    // Create test group if it doesn't exist
    const existingGroup = await db.collection('group_uploaded').findOne({ group_id: groupId })
    if (!existingGroup) {
      await db.collection('group_uploaded').insertOne({
        group_id: groupId,
        category: 'General',
        price: 0.1,
        pricing_mode: 'per-person',
        member_count: 100,
        reward_vxum: 5,
        reward_usd: 1,
        uploader_id: payload.userId,
        timestamp: new Date()
      })
    }

    const results = {
      successful: 0,
      failed: 0,
      totalEarnings: 0
    }

    // Simulate multiple user payments
    for (let i = 0; i < numUsers; i++) {
      try {
        const depositAmount = 0.1 // $0.1 per person
        const mediatorAmount = depositAmount * 0.9 // 90% revenue share

        // Record deposit
        await db.collection('user_deposit').insertOne({
          user_id: `test_user_${i}`,
          deposit_amount: depositAmount,
          group_id: groupId,
          timestamp: new Date()
        })

        // Record earnings
        await db.collection('earnings').insertOne({
          uploader_id: payload.userId,
          group_id: groupId,
          amount: mediatorAmount,
          status: 'pending',
          created_at: new Date(),
          paid_at: null
        })

        // Create notification
        const message = `Payment received: $${depositAmount.toFixed(2)} from test_user_${i}. Your earnings: $${mediatorAmount.toFixed(2)}`
        await db.collection('notifications').insertOne({
          message,
          temp_id: payload.userId,
          timestamp: new Date()
        })

        results.successful++
        results.totalEarnings += mediatorAmount
      } catch (error) {
        results.failed++
      }
    }

    const successRate = ((results.successful / numUsers) * 100).toFixed(2)

    return NextResponse.json({
      success: true,
      results: {
        ...results,
        totalEarnings: results.totalEarnings.toFixed(2),
        successRate: `${successRate}%`,
        numUsers
      }
    })
  } catch (error) {
    console.error('[v0] Error simulating payment flow:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
