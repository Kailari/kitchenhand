import { resetDatabase, disconnectMongoose, connectMongoose } from '../../test/mongooseHelper'
import { TestQueryFunction, startQueryTestServer } from '../../test/apolloHelper'

import User, { IUser } from '../../models/User'
import { createUser, createRecipe, allUsers, TestUser, allRecipes } from '../../test/createRows'
import authService from '../../services/authService'
import Recipe, { IRecipe } from '../../models/Recipe'
import { UserPermissions } from '../../generated/graphql'

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

const allRecipesQuery = () => `
  query {
    allRecipes {
      id
      name
      description
      owner {
        id
      }
    }
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

const userRecipesQuery = (id: string) => `
  query {
    userRecipes(id: "${id}") {
      id
      name
      description
      owner {
        id
      }
    }
  }
`

const addRecipeMutation = (name: string, description: string) => `
  mutation {
    addRecipe(name: "${name}", description: "${description}") {
      id
      name
      description
      owner {
        id
      }
    }
  }
`

const removeRecipeMutation = (id: string) => `
  mutation {
    removeRecipe(id: "${id}") {
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

    test('querying allRecipes rejects with code UNAUTHENTICATED', async () => {
      await expect(query(allRecipesQuery())).rejects.toContainApolloError('UNAUTHENTICATED')
    })

    test('querying userRecipes rejects with code UNAUTHENTICATED', async () => {
      await expect(query(userRecipesQuery(allUsers[0].id))).rejects.toContainApolloError('UNAUTHENTICATED')
    })

    describe('mutating with addRecipe', () => {
      test('rejects with code UNAUTHENTICATED', async () => {
        await expect(query(addRecipeMutation('some recipe', 'some description'))).rejects.toContainApolloError('UNAUTHENTICATED')
      })

      test('does not add new recipes', async () => {
        await expect(query(addRecipeMutation('some recipe', 'some description'))).toReject()
        await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES)
      })
    })

    describe('mutating with removeRecipe', () => {
      test('rejects with code UNAUTHENTICATED', async () => {
        await expect(query(removeRecipeMutation(allRecipes[0].id))).rejects.toContainApolloError('UNAUTHENTICATED')
      })

      test('removeRecipe does not remove any recipes', async () => {
        await expect(query(addRecipeMutation('some recipe', 'some description'))).toReject()
        await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES)
      })
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

    // FIXME: Uncomment when paginated recipe queries are implemented and allRecipes is made require PRIVATE_QUERIES
    //test('querying allRecipes rejects with code UNAUTHENTICATED, with message containing "insufficient permissions"', async () => {
    //  await expect(query(allRecipesQuery(), { authorization: token }))
    //    .rejects
    //    .toContainApolloError('UNAUTHENTICATED', expect.stringContaining('Insufficient permissions'))
    //})

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

    describe('querying userRecipes', () => {
      test('returns correct number of recipes', async () => {
        const result = await query(userRecipesQuery(allUsers[2].id), { authorization: token })
        expect(result.userRecipes.length).toBe(NUM_RECIPES)
      })

      test('returns correct owner for the recipes', async () => {
        const user = allUsers[2]
        const result = await query(userRecipesQuery(user.id), { authorization: token })
        for (let i = 0; i < result.userRecipes.length; i++) {
          expect(result.userRecipes[i].owner.id).toEqual(user.id)
        }
      })
    })

    describe('mutating with addRecipe', () => {
      describe('with invalid arguments', () => {
        test('rejects with code BAD_USER_INPUT', async () => {
          await expect(query(addRecipeMutation('a', 'b'), { authorization: token }))
            .rejects
            .toContainApolloError('BAD_USER_INPUT')
        })

        test('does not add new recipe', async () => {
          await expect(query(addRecipeMutation('a', 'b'), { authorization: token })).toReject()
          await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES)
        })
      })

      describe('with valid arguments', () => {
        test('adds a new recipe', async () => {
          await expect(query(addRecipeMutation('New Recipe', 'An awesome test recipe!'), { authorization: token })).toResolve()
          await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES + 1)
        })

        test('returns the added recipe', async () => {
          await expect(query(addRecipeMutation('New Recipe', 'An awesome test recipe!'), { authorization: token }))
            .resolves
            .toMatchObject({
              addRecipe: {
                name: 'New Recipe',
                description: 'An awesome test recipe!',
                owner: {
                  id: loggedInUser.id,
                }
              }
            })
        })

        test('returns the added recipe with correct owner', async () => {
          await expect(query(addRecipeMutation('New Recipe', 'An awesome test recipe!'), { authorization: token }))
            .resolves
            .toMatchObject({
              addRecipe: {
                owner: {
                  id: loggedInUser.id,
                }
              }
            })
        })

        test('pushes the added recipe to owner\'s recipes', async () => {
          const result = await query(addRecipeMutation('New Recipe', 'An awesome test recipe!'), { authorization: token })
          const addedId = result.addRecipe.id

          const updatedUser = await User.findById(loggedInUser.id).populate('recipes')
          expect(updatedUser).not.toBeNull()

          const user = updatedUser as IUser
          expect(user.recipes).toSatisfy((recipes: IRecipe[]) => recipes.map((r) => r.id).includes(addedId))
        })
      })
    })

    describe('mutating with removeRecipe', () => {
      describe('with invalid arguments', () => {
        test('rejects with code BAD_USER_INPUT', async () => {
          await expect(query(removeRecipeMutation('invalid ID'), { authorization: token }))
            .rejects
            .toContainApolloError('BAD_USER_INPUT')
        })

        test('does not remove any recipes', async () => {
          await expect(query(removeRecipeMutation('invalid ID'), { authorization: token })).toReject()
          await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES)
        })
      })

      describe('with valid ID', () => {
        test('removes the recipe', async () => {
          const recipe = await Recipe.findOne({ owner: loggedInUser.id }) as IRecipe
          await expect(query(removeRecipeMutation(recipe.id), { authorization: token })).toResolve()
          await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES - 1)
        })

        test('returns the removed recipe', async () => {
          const recipe = await Recipe.findOne({ owner: loggedInUser.id }) as IRecipe
          await expect(query(removeRecipeMutation(recipe.id), { authorization: token }))
            .resolves
            .toMatchObject({
              removeRecipe: {
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                owner: {
                  id: loggedInUser.id,
                }
              }
            })
        })

        test('rejects with if user does not own the recipe', async () => {
          const recipe = await Recipe.findOne({ owner: allUsers[3].id }) as IRecipe
          await expect(query(removeRecipeMutation(recipe.id), { authorization: token }))
            .rejects
            .toContainApolloError('UNAUTHENTICATED', expect.stringContaining('Only owner'))
        })

        test('removes the removed recipe from owner\'s recipes', async () => {
          const recipe = await Recipe.findOne({ owner: loggedInUser.id }) as IRecipe
          await expect(query(removeRecipeMutation(recipe.id), { authorization: token })).toResolve()

          const updatedUser = await User.findById(loggedInUser.id).populate('recipes')
          expect(updatedUser).not.toBeNull()

          const user = updatedUser as IUser
          expect(user.recipes).not.toSatisfy((recipes: IRecipe[]) => recipes.map((r) => r.id).includes(recipe.id))
        })
      })
    })
  })

  describe('while logged in as the SuperUser', () => {
    let token = 'undefined'
    //let loggedInUser: TestUser
    beforeEach(async () => {
      const user = await createUser({
        name: 'SuperUser',
        loginname: 'superuser',
        password: 'superuserpass',
        permissions: [
          UserPermissions.PrivateQueries,
          UserPermissions.Admin,
          UserPermissions.Superuser,
        ]
      })
      const loginResult = await authService.login(user.loginname, user.plaintextPassword)
      token = `bearer ${loginResult.value}`
      //loggedInUser = user
    })

    test('querying recipeCount returns correct count', async () => {
      await expect(query(recipeCountQuery(), { authorization: token }))
        .resolves
        .toMatchObject({ recipeCount: NUM_USERS * NUM_RECIPES })
    })

    test('querying allRecipes returns correct number of recipes', async () => {
      const result = await query(allRecipesQuery(), { authorization: token })
      expect(result.allRecipes.length).toBe(NUM_USERS * NUM_RECIPES)
    })

    test('mutating with removeRecipe on non-owned recipe succeeds', async () => {
      const recipe = await Recipe.findOne({}) as IRecipe
      await expect(query(removeRecipeMutation(recipe.id), { authorization: token })).toResolve()
      await expect(Recipe.countDocuments({})).resolves.toBe(NUM_USERS * NUM_RECIPES - 1)
    })
  })
})
