const { connectMongoose, resetDatabase, disconnectMongoose } = require('../test/mongooseHelper')
const { createUser } = require('../test/createRows')
const { ValidationError } = require('mongoose')

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

  describe('if currentUser is null', () => {
    const context = {
      currentUser: null,
    }

    test('userCount() throws `Not authenticated`', async () => {
      expect(() => { authService.userCount(context) }).toThrow('Not authenticated')
    })

    test('getAll() throws `Not authenticated`', async () => {
      expect(() => { authService.getAll(context) }).toThrow('Not authenticated')
    })

    test('find() throws `Not authenticated`', async () => {
      expect(() => { authService.find(context, 'invalid id') }).toThrow('Not authenticated')
    })
  })

  describe('if current user is a valid normal user', () => {

    test('userCount() matches', () => {

    })

    test('getAll() returns correct number of users', () => {

    })

    test('getAll() returns all users', () => {

    })

    describe('find(id) returns', () => {
      test('a valid user when user with the id exists', async () => {

      })

      test('null when user with the id does not exist', async () => {

      })
    })
  })
})