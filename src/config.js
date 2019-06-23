require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)
let dbUri, saltRounds, jwtSecret, port
if (process.env.NODE_ENV === 'test') {
  port = 4000
  dbUri = global.__MONGO_URI__
  jwtSecret = 'test_secret'
  saltRounds = 1
} else {
  port = process.env.PORT
  jwtSecret = process.env.JWT_SECRET
  dbUri = process.env.DATABASE_URL
  saltRounds = 10
}

const SALT_ROUNDS = saltRounds
const MONGODB_URI = dbUri
const JWT_SECRET = jwtSecret
const PORT = port

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
  PORT,
  SALT_ROUNDS
}