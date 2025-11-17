-- MongoDB Collection Setup Guide
-- Run these commands in MongoDB shell or MongoDB Compass

-- 1. Create database
use mediator_channel;

-- 2. Create collections with validation
db.createCollection("group_uploaded", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["group_id", "category", "price", "uploader_id", "timestamp"],
      properties: {
        group_id: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9]{6,20}$",
          description: "must be 6-20 alphanumeric characters"
        },
        category: {
          enum: ["General", "Entertainment", "E-commerce", "Finance", "Stocks", "Cryptocurrency"]
        },
        price: {
          bsonType: "number",
          minimum: 0.1,
          maximum: 150
        },
        uploader_id: {
          bsonType: "string"
        },
        timestamp: {
          bsonType: "date"
        }
      }
    }
  }
});

-- 3. Create indexes for performance
db.group_uploaded.createIndex({ "group_id": 1 }, { unique: true });
db.earnings.createIndex({ "uploader_id": 1 });
db.earnings.createIndex({ "status": 1, "created_at": 1 });
db.user_deposit.createIndex({ "group_id": 1 });
db.notifications.createIndex({ "temp_id": 1, "timestamp": -1 });

-- 4. Collections will be created automatically on first insert:
-- - user_deposit
-- - earnings
-- - notifications
