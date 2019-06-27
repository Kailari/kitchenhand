import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInputError, AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

import { Context } from '../server'
import * as config from '../config'
import User, { IUser } from '../models/User'

interface TokenData {
  loginname: string,
  id: mongoose.Types.ObjectId,
}

// Wraps function given as argument, adding context argument and auth check to it
export const withAuth = <T, U extends T[], V>(fn: (...args: U) => V): ((context: Context, ...args: U) => V) => {
  return function (context: Context, ...args: U): V {
    if (!context || !context.currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    return fn(...args)
  }
}

export const withAuthAsync = <T, U extends T[], V>(fn: (...args: U) => V): ((context: Context, ...args: U) => Promise<V>) => {
  return async function (context: Context, ...args: U): Promise<V> {
    if (!context || !context.currentUser) {
      throw new AuthenticationError('Not authenticated')
    }

    return fn(...args)
  }
}

const userCount = withAuthAsync(async (): Promise<number> => {
  return await User.collection.countDocuments()
})

const getAll = withAuthAsync(async (): Promise<IUser[]> => {
  return await User.find({})
})

const find = withAuthAsync(async (id: string | mongoose.Types.ObjectId): Promise<IUser | null> => {
  try {
    return await User.findById(id)
  } catch (ignored) {
    return null
  }
})


const register = async (name: string, loginname: string, password: string): Promise<IUser> => {
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

export interface LoginResult {
  value: string,
}

const login = async (loginname: string, password: string): Promise<LoginResult> => {
  if (!loginname) {
    throw new UserInputError('`loginname` is required', {
      invalidArgs: ['loginname']
    })
  }

  if (!password) {
    throw new UserInputError('`password` is required', {
      invalidArgs: ['password']
    })
  }

  const user = await User.findOne({ loginname: loginname })
  const passwordCorrect = user && await bcrypt.compare(password, user.password)

  if (!user || !passwordCorrect) {
    throw new UserInputError('Invalid `loginname` or `password`', {
      invalidArgs: ['loginname', 'password']
    })
  }

  const tokenUser: TokenData = {
    loginname: user.loginname,
    id: user._id
  }

  return { value: jwt.sign(tokenUser, config.JWT_SECRET) }
}

const getUserFromToken = async (token: string): Promise<IUser | null> => {
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

  withAuth,
  withAuthAsync
}
