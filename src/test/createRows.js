const config = require('../config')
const User = require('../models/User')
const bcrypt = require('bcrypt')

const createUser = async (overrides) => {
  const n = (global.__COUNTERS__.user += 1)
  const user = new User({
    name: `Normal user #${n}`,
    loginname: `normie_${n}`,
    password: await bcrypt.hash(`some_secret_${n}`, config.SALT_ROUNDS),
    ...overrides
  })

  return user.save()
}

module.exports = {
  createUser
}