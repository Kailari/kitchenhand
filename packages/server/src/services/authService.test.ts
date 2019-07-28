import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server'
import jwt from 'jsonwebtoken'

import config from '../config'
import { connectMongoose, resetDatabase, disconnectMongoose } from '../test/mongooseHelper'
import { allUsers, createUser } from '../test/createRows'
import { IUser } from '../models/User'

import authService from './authService'

beforeAll(connectMongoose)

beforeEach(resetDatabase)

afterAll(disconnectMongoose)

const NUM_USERS = 10
describe(`with a newly initialized test database with ${NUM_USERS} users`, () => {
  beforeEach(async () => {
    const promises: Promise<IUser>[] = []
    for (let i = 1; i <= NUM_USERS; i++) {
      await createUser()
    }

    await Promise.all(promises)
  })

  describe('register()', () => {
    const VERY_LONG_STRING = 'some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string'

    test('throws if name is too short', async () => {
      await expect(authService.register('a', 'avalidname', 'some_secret'))
        .rejects
        .toThrow()
    })

    test('throws if loginname too short', async () => {
      await expect(authService.register('A Valid Name', 'a', 'some_secret'))
        .rejects
        .toThrow()
    })

    test('throws if password is too short', async () => {
      await expect(authService.register('A Valid Name', 'avalidname', 'a'))
        .rejects
        .toThrow()
    })

    test('throws if name is too long', async () => {
      await expect(authService.register(VERY_LONG_STRING, 'avalidname', 'some_secret'))
        .rejects
        .toThrow()
    })

    test('throws if loginname too long', async () => {
      await expect(authService.register('A Valid Name', VERY_LONG_STRING, 'some_secret'))
        .rejects
        .toThrow()
    })

    test('throws if password is too long', async () => {
      await expect(authService.register('A Valid Name', 'avalidname', VERY_LONG_STRING))
        .rejects
        .toThrow()
    })

    test('returns the created user if parameters are valid', async () => {
      const userInfo = {
        name: 'Jaska Jokunen',
        loginname: 'jaskajoku',
        password: 'some_secret'
      }

      const user = await authService.register(userInfo.name, userInfo.loginname, userInfo.password)
      expect(user).not.toBeNull()
      expect(user.name).toBe(userInfo.name)
      expect(user.loginname).toBe(userInfo.loginname)
    })
  })

  describe('login()', () => {
    test('throws UserInputError if loginname is invalid', async () => {
      await expect(authService.login('idonotexist', 'some_password'))
        .rejects
        .toThrow(UserInputError)
    })

    test('throws UserInputError if password is wrong', async () => {
      await expect(authService.login('normie_1', 'wrong_password'))
        .rejects
        .toThrow(UserInputError)
    })

    test('returns a token if password is correct', async () => {
      await expect(authService.login('normie_1', 'some_secret_1'))
        .resolves
        .toMatchObject({
          value: expect.any(String)
        })
    })
  })

  describe('getUserFromToken()', () => {
    test('returns null if token is invalid', async () => {
      await expect(authService.getUserFromToken('invalid token'))
        .resolves
        .toBeNull()
    })

    test('returns correct user if token is valid', async () => {
      const user = allUsers[5]
      const tokenUser = {
        loginname: user.loginname,
        id: user._id
      }
      const token = jwt.sign(tokenUser, config.JWT_SECRET)

      const resolved = await authService.getUserFromToken(token) as IUser
      expect(resolved._id).toStrictEqual(tokenUser.id)
      expect(resolved.loginname).toBe(tokenUser.loginname)
    })
  })

  test('userCount() returns correct count', async () => {
    await expect(authService.userCount())
      .resolves
      .toEqual(NUM_USERS)
  })

  test('getAll() returns correct number of users', async () => {
    await expect(authService.getAll())
      .resolves
      .toHaveLength(NUM_USERS)
  })

  test('getAll() returns all users', async () => {
    const users = await authService.getAll()

    // FIXME: Mongoose ObjectIDs are not treated equal unless compared with .equals
    //        Jest uses `===` and `Object.is` to compare equality in `toContain*`-methods,
    //        meaning that IDs are not considered equal even when they should be
    //        Converting to strings obviously fixes the issue, but is kind of hacky.
    const idToString = (u: IUser) => u._id = u._id.toString()
    const allUsersMapped = allUsers.map(idToString)
    const usersMapped = users.map(idToString)

    await expect(usersMapped)
      .toIncludeSameMembers(allUsersMapped)
  })

  describe('find(id) returns', () => {
    test('null when user with the id does not exist', async () => {
      await expect(authService.find('invalid id'))
        .resolves
        .toBeNull()
      const id = mongoose.Types.ObjectId()
      await expect(authService.find(id))
        .resolves
        .toBeNull()
    })

    test('a non-null user when user with the id exists', async () => {
      const id = allUsers[5]._id
      await expect(authService.find(id))
        .resolves
        .not
        .toBeNull()
    })

    test('correct user when user with the id exists', async () => {
      const user = allUsers[5]
      await expect(authService.find(user.id))
        .resolves
        .not
        .toEqual(user)
    })
  })
})
