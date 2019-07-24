import supertest from 'supertest'

import app from '../../server'
import { resetDatabase, disconnectMongoose, connectMongoose } from '../../test/mongooseHelper'
import { IUser } from '../../models/User'
import { createUser, createRecipe, allUsers, TestUser, allRecipes } from '../../test/createRows'
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

const recipeCountQuery = () => `
  query {
    recipeCount
  }
`

const myRecipesQuery = () => `
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

const recipeQuery = (id: string) => `
  query {
    recipe(id: "${id}") {
      id
      name
      description
      owner {
        id
      }
    }
  }
`

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

  describe('while not logged in', () => {
    test('querying recipeCount rejects with code UNAUTHENTICATED', async () => {
      await expect(query(recipeCountQuery())).rejects.toContainApolloError('UNAUTHENTICATED')
    })

    test('querying myRecipes rejects with code UNAUTHENTICATED', async () => {
      await expect(query(myRecipesQuery())).rejects.toContainApolloError('UNAUTHENTICATED')
    })

    test('querying recipe rejects with code UNAUTHENTICATED', async () => {
      await expect(query(recipeQuery(allRecipes[0].id))).rejects.toContainApolloError('UNAUTHENTICATED')
    })
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
      await expect(query(recipeCountQuery(), { authorization: token }))
        .rejects
        .toContainApolloError('UNAUTHENTICATED', expect.stringContaining('Insufficient permissions'))
    })

    describe('querying myRecipes', () => {
      test('returns correct number of recipes', async () => {
        const result = await query(myRecipesQuery(), { authorization: token })
        expect(result.myRecipes.length).toBe(NUM_RECIPES)
      })

      test('returns correct owner for the recipes', async () => {
        const result = await query(myRecipesQuery(), { authorization: token })
        for (let i = 0; i < result.myRecipes.length; i++) {
          expect(result.myRecipes[i].owner.id).toEqual(loggedInUser.id)
        }
      })
    })

    describe('querying recipe', () => {
      test('rejects with error code BAD_USER_INPUT, with message containing `id` when id is invalid', async () => {
        await expect(query(recipeQuery('an invalid ID'), { authorization: token }))
          .rejects
          .toContainApolloError('BAD_USER_INPUT', expect.stringContaining('id'))
      })

      test('returns the correct recipe when ID is valid', async () => {
        const expected = allRecipes[2]
        const result = await query(recipeQuery(expected.id), { authorization: token })
        expect(result.recipe).toMatchObject({
          id: expected.id,
          name: expected.name,
          description: expected.description,
          owner: { id: expected.owner.id }
        })
      })
    })
  })
})
