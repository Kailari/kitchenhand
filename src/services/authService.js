const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')
const User = require('../models/User')

const userCount = () => {
  return User.collection.countDocuments()
}

const getAll = () => {
  return User.find({})
}

const find = (id) => {
  return User.findById(id)
}


const register = async (name, loginname, password) => {
  // TODO: validate password

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name: name,
    loginname: loginname,
    password: hashedPassword
  })

  return user.save()
}

const login = async (loginname, password) => {
  const user = await User.findOne({ loginname: loginname })
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.password)

  if (!correctPassword) {
    return null
  }

  const tokenUser = {
    loginname: user.loginname,
    id: user._id
  }

  return { value: jwt.sign(tokenUser, config.JWT_SECRET) }
}

const getUserFromToken = (tokenString) => {
  const decodedToken = jwt.verify(tokenString, config.JWT_SECRET)

  return User.findById(decodedToken.id)
}

module.exports = {
  userCount,
  find,
  getAll,

  register,
  login,
  getUserFromToken
}