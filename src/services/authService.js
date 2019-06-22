const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config')
const User = require('../models/User')
const { UserInputError, AuthenticationError } = require('apollo-server')

const requireAuth = (fn) => {
  return (context, ...otherArgs) => {
    if (!context || !context.currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    return fn(...otherArgs)
  }
}

const userCount = requireAuth(() => {
  return User.collection.countDocuments()
})

const getAll = requireAuth(() => {
  return User.find({})
})

const find = requireAuth((id) => {
  return User.findById(id)
})


const register = async (name, loginname, password) => {
  if (!password) {
    throw new UserInputError('`password` is required')
  }

  if (password.length < 6 || password.length > 128) {
    throw new UserInputError('password must be 6 to 128 characters long')
  }

  const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS)

  const user = new User({
    name: name,
    loginname: loginname,
    password: hashedPassword
  })

  return user.save()
}

const login = async (loginname, password) => {
  if (loginname === null) {
    throw new UserInputError('`loginname` is required')
  }

  if (password === null) {
    throw new UserInputError('`password` is required')
  }

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