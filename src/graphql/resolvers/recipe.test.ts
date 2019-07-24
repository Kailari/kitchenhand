import supertest from 'supertest'

import app from '../../server'
import { resetDatabase, disconnectMongoose, connectMongoose } from '../../test/mongooseHelper'
import { IUser } from '../../models/User'
import { createUser, createRecipe, allUsers, TestUser } from '../../test/createRows'
import authService from '../../services/authService'

// TODO: Move elsewhere, generalize and clean up

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestQueryFunction = <TData = any>(query: string, headers?: { [key: string]: string }, expectedHttpResponse?: number) => Promise<TData>

const createQuery = (server: supertest.SuperTest<supertest.Test>): TestQueryFunction =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async <TData = any>(
    query: string,
    headers?: { [key: string]: string },
    expectedHttpResponse?: number
  ): Promise<TData> => {
    const request = server.post('/graphql')

    if (headers) {
      for (const key in headers) {
        request.set(key, headers[key])
      }
    }

    request
      .send({ query: query || '' })
      .expect(!!expectedHttpResponse || 200)

    try {
      const result = await request
      if (result.body.errors) {
        return Promise.reject(result.body.errors)
      }

      return result.body.data
    } catch (error) {
      throw new Error(`Error creating query: ${error}`)
    }
  }

const startQueryTestServer = (): TestQueryFunction => {
  const server = supertest(app)
  return createQuery(server)
}

beforeAll(connectMongoose)

let query: TestQueryFunction
beforeEach(async () => {
  await resetDatabase()
  query = startQueryTestServer()
})

afterAll(disconnectMongoose)

const QUERY_RECIPE_COUNT = `
  query {
    recipeCount
  }
`

const QUERY_MY_RECIPES = `
  query {
    myRecipes {
      id
      name
      description
      owner {
        id
      }
    }
  }
`

describe('With an empty database', () => {
  describe('while not logged in', () => {
    test('querying recipeCount rejects with code UNAUTHENTICATED', async () => {
      await expect(query(QUERY_RECIPE_COUNT))
        .rejects
        .toContainApolloError('UNAUTHENTICATED')
    })
  })
})

const NUM_USERS = 10
const NUM_RECIPES = 3
describe(`With a test database with ${NUM_USERS} users with ${NUM_RECIPES} recipes per user`, () => {
  beforeEach(async () => {
    const promises: Promise<IUser>[] = []
    for (let i = 1; i <= NUM_USERS; i++) {
      const user = await createUser()
      for (let j = 1; j <= NUM_RECIPES; j++) {
        await createRecipe(user)
      }
    }

    await Promise.all(promises)
  })

  describe('while logged in as a regular user', () => {
    let token = 'undefined'
    let loggedInUser: TestUser
    beforeEach(async () => {
      const user = allUsers[0]
      const loginResult = await authService.login(user.loginname, user.plaintextPassword)
      token = `bearer ${loginResult.value}`
      loggedInUser = user
    })

    test('querying recipeCount rejects with code UNAUTHENTICATED, with message containing "insufficient permissions"', async () => {
      await expect(query(QUERY_RECIPE_COUNT, { authorization: token }))
        .rejects
        .toContainApolloError('UNAUTHENTICATED', expect.stringContaining('Insufficient permissions'))
    })

    describe('querying myRecipes', () => {
      test('returns correct number of recipes', async () => {
        const result = await query(QUERY_MY_RECIPES, { authorization: token })
        expect(result.myRecipes.length).toBe(NUM_RECIPES)
      })

      test('returns correct owner for the recipes', async () => {
        const result = await query(QUERY_MY_RECIPES, { authorization: token })
        for (let i = 0; i < result.myRecipes.length; i++) {
          expect(result.myRecipes[i].owner.id).toEqual(loggedInUser.id)
        }
      })
    })
  })
})
