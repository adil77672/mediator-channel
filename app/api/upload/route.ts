import { NextRequest, NextResponse } from 'next/server'
import { connectDB, db } from '@/lib/db'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth'
import { groupUploadSchema } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const payload = await verifyAuthToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = groupUploadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((issue) => issue.message).join(', ') },
        { status: 400 }
      )
    }

    const { group_id, category, price, pricing_mode, member_count } = parsed.data

    // Connect to database
    await connectDB()

    // Check if group_id already exists
    const existingGroup = await db.collection('group_uploaded').findOne({ group_id })
    if (existingGroup) {
      return NextResponse.json(
        { status: 'duplicate', reward: existingGroup.reward_vxum ?? 0 },
        { status: 200 }
      )
    }

    const reward = getReward(member_count)

    // Insert new group
    const result = await db.collection('group_uploaded').insertOne({
      group_id,
      category,
      price,
      pricing_mode,
      member_count,
      reward_vxum: reward.vxum,
      reward_usd: reward.usd,
      uploader_id: payload.userId,
      timestamp: new Date()
    })

    return NextResponse.json({
      status: 'success',
      reward: reward.vxum,
      reward_usd: reward.usd,
      id: result.insertedId
    })
  } catch (error) {
    console.error('[v0] Error uploading group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getReward(memberCount: number) {
  if (memberCount <= 100) {
    return { vxum: 5, usd: 1 }
  }
  if (memberCount <= 200) {
    return { vxum: 6, usd: 2 }
  }
  if (memberCount <= 300) {
    return { vxum: 7, usd: 3 }
  }
  if (memberCount <= 400) {
    return { vxum: 8, usd: 4 }
  }
  return { vxum: 10, usd: 5 }
}
