require('dotenv').config()
import mongoose from 'mongoose'

mongoose.set('useFindAndModify', false)
let dbUri: string
let jwtSecret: string
let saltRounds: number
let port: number
if (process.env.NODE_ENV === 'test') {
  port = 4000
  dbUri = global.MONGO_URI
  jwtSecret = 'test_secret'
  saltRounds = 1
} else {
  port = +(process.env.PORT || '0')
  jwtSecret = process.env.JWT_SECRET || ''
  dbUri = process.env.DATABASE_URL || ''
  saltRounds = 10
}

const SALT_ROUNDS = saltRounds
const MONGODB_URI = dbUri
const JWT_SECRET = jwtSecret
const PORT = port
const STATIC_FILE_PATH = '../static/'

export {
  MONGODB_URI,
  JWT_SECRET,
  PORT,
  SALT_ROUNDS,
  STATIC_FILE_PATH
}
