import config from '../config'
import User, { IUser } from '../models/User'
import { hash } from 'bcrypt'
import Recipe, { IRecipe } from '../models/Recipe'

interface Counters {
  user: number,
  recipe: number,
}

export interface TestUser extends IUser {
  plaintextPassword: string,
}

let counters: Counters

const allUsers: TestUser[] = []
const allRecipes: IRecipe[] = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createUser = async (...overrides: any[]): Promise<IUser> => {
  const n = (counters.user += 1)
  const iuser = new User({
    name: `Normal user #${n}`,
    loginname: `normie_${n}`,
    password: await hash(`some_secret_${n}`, config.SALT_ROUNDS),
    ...overrides
  })

  const user = iuser as TestUser
  user.plaintextPassword = `some_secret_${n}`

  const savedUser = await user.save()
  allUsers.push(savedUser)
  return savedUser
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRecipe = async (owner: IUser, ...overrides: any[]): Promise<IRecipe> => {
  const n = (counters.recipe += 1)
  const recipe = new Recipe({
    name: `Recipe #${n}`,
    description: `Description for Recipe #${n}`,
    owner: owner.id,
    ingredients: [],
    ...overrides
  })

  const savedRecipe = await recipe.save()
  savedRecipe.owner = owner
  allRecipes.push(savedRecipe)
  return savedRecipe
}

const resetCounters = (): void => {
  counters = {
    user: 0,
    recipe: 0,
  }
}

export {
  createUser,
  allUsers,

  createRecipe,
  allRecipes,

  resetCounters
}
