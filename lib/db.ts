import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = 'mediator_channel'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDB() {
  if (db) return db

  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('[v0] Connected to MongoDB')
  }

  db = client.db(DB_NAME)

  // Create indexes for performance
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('group_uploaded').createIndex({ group_id: 1 }, { unique: true })
  await db.collection('earnings').createIndex({ uploader_id: 1 })
  await db.collection('user_deposit').createIndex({ group_id: 1 })
  await db.collection('notifications').createIndex({ temp_id: 1 })

  return db
}

export { db }
