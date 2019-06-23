const config = require('../config')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const allUsers = []

const createUser = async (overrides) => {
  const n = (global.__COUNTERS__.user += 1)
  const user = new User({
    name: `Normal user #${n}`,
    loginname: `normie_${n}`,
    password: await bcrypt.hash(`some_secret_${n}`, config.SALT_ROUNDS),
    ...overrides
  })

  const savedUser = await user.save()
  allUsers.push(savedUser)
  return savedUser
}

module.exports = {
  createUser,
  allUsers
}