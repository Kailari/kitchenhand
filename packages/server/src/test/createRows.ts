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
const createUser = async (overrides: { password?: string, [key: string]: any } = {}): Promise<TestUser> => {
  const n = (counters.user += 1)
  const password: string = overrides.password || `some_secret_${n}`
  delete overrides.password
  const iuser = new User({
    name: `Normal user #${n}`,
    loginname: `normie_${n}`,
    password: await hash(password, config.SALT_ROUNDS),
    ...overrides
  })

  const user = iuser as TestUser
  user.plaintextPassword = password

  const savedIUser = await user.save()
  const savedUser = savedIUser as TestUser
  savedUser.plaintextPassword = password
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
