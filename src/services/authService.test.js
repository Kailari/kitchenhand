const mongoose = require('mongoose')
const { ValidationError } = mongoose
const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const config = require('../config')
const { connectMongoose, resetDatabase, disconnectMongoose } = require('../test/mongooseHelper')
const { allUsers, createUser } = require('../test/createRows')

const authService = require('./authService')

beforeAll(connectMongoose)

beforeEach(resetDatabase)

afterAll(disconnectMongoose)

const NUM_USERS = 10
describe(`with a newly initialized test database with ${NUM_USERS} users`, () => {
  beforeEach(async () => {
    let promises = []
    for (var i = 1; i <= NUM_USERS; i++) {
      await createUser()
    }

    await Promise.all(promises)
  })

  describe('register()', () => {
    const VERY_LONG_STRING = 'some very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long string'

    test('throws if name is null', async () => {
      await expect(authService.register(null, 'avalidname', 'some_secret'))
        .rejects
        .toThrow(ValidationError)
    })

    test('throws if loginname is null', async () => {
      await expect(authService.register('A Valid Name', null, 'some_secret'))
        .rejects
        .toThrow()
    })

    test('throws if password is null', async () => {
      await expect(authService.register('A Valid Name', 'avalidname', null))
        .rejects
        .toThrow()
    })

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
    test('throws if loginname is null', async () => {
      await expect(authService.login(null, 'some_password'))
        .rejects
        .toThrow()
    })

    test('throws if password is null, regardless of loginname being valid', async () => {
      await expect(authService.login('idonotexist', null)).rejects.toThrow()
      await expect(authService.login('normie_1', null)).rejects.toThrow()
    })

    test('returns null if loginname is invalid', async () => {
      await expect(authService.login('idonotexist', 'some_password'))
        .resolves
        .toBeNull()
    })

    test('returns null if password is wrong', async () => {
      await expect(authService.login('normie_1', 'wrong_password'))
        .resolves
        .toBeNull()
    })

    test('returns a token if password is correct', async () => {
      await expect(authService.login('normie_1', 'some_secret_1'))
        .resolves
        .not
        .toBeNull()
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

      const resolved = await authService.getUserFromToken(token)
      expect(resolved._id).toStrictEqual(tokenUser.id)
      expect(resolved.loginname).toBe(tokenUser.loginname)
    })
  })

  describe('if currentUser is null', () => {
    const context = {
      currentUser: null,
    }

    test('requireAuth-decorated function throws AuthenticationError', async () => {
      const fn = authService.requireAuth(() => {
        // do nothing
      })

      await expect(fn(context))
        .rejects
        .toThrow(AuthenticationError)
    })

    test('userCount() throws AuthenticationError', async () => {
      await expect(authService.userCount(context))
        .rejects
        .toThrow(AuthenticationError)
    })

    test('getAll() throws AuthenticationError', async () => {
      await expect(authService.getAll(context))
        .rejects
        .toThrow(AuthenticationError)
    })

    test('find() throws AuthenticationError', async () => {
      await expect(authService.find(context, 'invalid id'))
        .rejects
        .toThrow(AuthenticationError)
    })
  })

  describe('if current user is a valid normal user', () => {
    let context

    beforeEach(async () => {
      context = {
        currentUser: allUsers[5]
      }
    })

    test('requireAuth-decorated function passes', async () => {
      const fn = authService.requireAuth(() => {
        return true
      })

      await expect(fn(context))
        .resolves
        .toBeTruthy()
    })

    test('userCount() matches', async () => {
      await expect(authService.userCount(context))
        .resolves
        .toEqual(NUM_USERS)
    })

    test('getAll() returns correct number of users', async () => {
      await expect(authService.getAll(context))
        .resolves
        .toHaveLength(NUM_USERS)
    })

    test('getAll() returns all users', async () => {
      const users = await authService.getAll(context)

      // FIXME: Mongoose ObjectIDs are not treated equal unless compared with .equals
      //        Jest uses `===` and `Object.is` to compare equality in `toContain*`-methods,
      //        meaning that IDs are not considered equal even when they should be
      //        Converting to strings obviously fixes the issue, but is kind of hacky.
      const idToString = (u) => u._id = u._id.toString()
      const allUsersMapped = allUsers.map(idToString)
      const usersMapped = users.map(idToString)

      await expect(usersMapped)
        .toIncludeSameMembers(allUsersMapped)
    })

    describe('find(id) returns', () => {
      test('null when user with the id does not exist', async () => {
        await expect(authService.find(context, 'invalid id'))
          .resolves
          .toBeNull()
        const id = mongoose.Types.ObjectId()
        await expect(authService.find(context, id))
          .resolves
          .toBeNull()
      })

      test('a non-null user when user with the id exists', async () => {
        const id = allUsers[5]._id
        await expect(authService.find(context, id))
          .resolves
          .not
          .toBeNull()
      })

      test('correct user when user with the id exists', async () => {
        const user = allUsers[5]
        await expect(authService.find(context, user))
          .resolves
          .not
          .toEqual(user)
      })
    })
  })
})