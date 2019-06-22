require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)
let dbUri, saltRounds
if (process.env.NODE_ENV === 'test') {
  dbUri = global.__MONGO_URI__
  saltRounds = 1
} else {
  dbUri = process.env.DATABASE_URL
  saltRounds = 10
}

const SALT_ROUNDS = saltRounds
const MONGODB_URI = dbUri
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT

module.exports = {
  MONGODB_URI,
  JWT_SECRET,
  PORT,
  SALT_ROUNDS
}