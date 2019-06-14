require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)
const MONGODB_URI = process.env.DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  MONGODB_URI,
  JWT_SECRET
}