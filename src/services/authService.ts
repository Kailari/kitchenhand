import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInputError, AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

import { Context } from '../server'
import * as config from '../config'
import User, { IUser } from '../models/User'

interface TokenData {
  loginname: string,
  id: mongoose.Types.ObjectId
}

type AuthenticatedFunction<T> = (context: Context, ...otherArgs: any[]) => Promise<T>
type AuthenticationRequiringFunction<T> = (...args: any[]) => Promise<T>

const requireAuth = <T>(fn: AuthenticationRequiringFunction<T>): AuthenticatedFunction<T> => {
  return async (context, ...otherArgs) => {
    if (!context || !context.currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    return fn(...otherArgs)
  }
}

const userCount = requireAuth(async () => {
  return await User.collection.countDocuments()
})

const getAll = requireAuth(async () => {
  return await User.find({}) as IUser[]
})

const find = requireAuth(async (id): Promise<IUser | null> => {
  try {
    return await User.findById(id)
  } catch (ignored) {
    return null
  }
})


const register = async (name: string, loginname: string, password: string) => {
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

  return await user.save()
}

const login = async (loginname: string, password: string) => {
  if (!loginname) {
    throw new UserInputError('`loginname` is required')
  }

  if (!password) {
    throw new UserInputError('`password` is required')
  }

  const user = await User.findOne({ loginname: loginname })
  if (!user) {
    return null
  }

  if (!await bcrypt.compare(password, user.password)) {
    return null
  }

  const tokenUser: TokenData = {
    loginname: user.loginname,
    id: user._id
  }

  return { value: jwt.sign(tokenUser, config.JWT_SECRET) }
}

const getUserFromToken = async (token: string) => {
  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET) as TokenData
    return await User.findById(decodedToken.id)
  } catch (ignored) {
    return null
  }
}

export default {
  userCount,
  find,
  getAll,

  register,
  login,
  getUserFromToken,

  requireAuth
} 