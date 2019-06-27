import { UserInputError } from 'apollo-server'

import authService, { LoginResult } from '../../services/authService'
import { QueryResolvers, MutationResolvers } from '../../generated/graphql'
import { IUser } from '../../models/User'

export const queries: QueryResolvers = {
  userCount: (root, args, context): Promise<number> => authService.userCount(context),
  allUsers: (root, args, context): Promise<IUser[]> => authService.getAll(context),
  findUser: async (root, args, context): Promise<IUser | null> => {
    if (!args.id) {
      throw new UserInputError('`id` is required', { invalidArgs: 'id' })
    }

    return await authService.find(context, args.id)
  },
  me: (root, args, context): IUser | null => context.currentUser
}

export const mutations: MutationResolvers = {
  registerUser: async (root, args): Promise<IUser> => {
    let newUser = null
    try {
      newUser = await authService.register(args.name, args.loginname, args.password)
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: Object.keys(error.errors)
      })
    }

    return newUser
  },
  login: async (root, args): Promise<LoginResult> => {
    const errors: { message: string, arg: string }[] = []

    if (!args.loginname || args.loginname === '') {
      errors.push({ message: '`loginname` is required', arg: 'loginname' })
    }

    if (!args.password || args.password === '') {
      errors.push({ message: '`password` is required', arg: 'password' })
    }

    if (errors.length > 0) {
      throw new UserInputError(
        errors.map((e): string => e.message).join(),
        { invalidArgs: errors.map((e): string => e.arg) })
    }

    const token = await authService.login(args.loginname, args.password)

    if (token === null) {
      throw new UserInputError('Bad loginname or password', { invalidArgs: ['loginname', 'password'] })
    }

    return token
  },
}
