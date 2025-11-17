import { NextRequest, NextResponse } from 'next/server'
import { connectDB, db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, group_id, deposit_amount } = body

    if (!user_id || !group_id || !deposit_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get group info
    const group = await db.collection('group_uploaded').findOne({ group_id })
    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Record deposit
    await db.collection('user_deposit').insertOne({
      user_id,
      deposit_amount,
      group_id,
      timestamp: new Date()
    })

    // Calculate mediator earnings (90% = 70% base + 20% commission)
    const mediatorAmount = deposit_amount * 0.9

    // Record earnings
    await db.collection('earnings').insertOne({
      uploader_id: group.uploader_id,
      group_id,
      amount: mediatorAmount,
      status: 'pending',
      created_at: new Date(),
      paid_at: null
    })

    // Create notification
    const message = `Payment received: $${deposit_amount.toFixed(2)} for group ${group_id}. Your earnings: $${mediatorAmount.toFixed(2)}`
    await db.collection('notifications').insertOne({
      message,
      temp_id: group.uploader_id,
      timestamp: new Date()
    })

    return NextResponse.json({
      success: true,
      message: 'Payment processed',
      earnings: mediatorAmount.toFixed(2)
    })
  } catch (error) {
    console.error('[v0] Error processing payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
