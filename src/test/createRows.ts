import { SALT_ROUNDS } from '../config'
import User, { IUser } from '../models/User'
import { hash } from 'bcrypt'

interface Counters {
  user: number
}

let counters: Counters

const allUsers: IUser[] = []

const createUser = async (overrides: any = []) => {
  const n = (counters.user += 1)
  const user = new User({
    name: `Normal user #${n}`,
    loginname: `normie_${n}`,
    password: await hash(`some_secret_${n}`, SALT_ROUNDS),
    ...overrides
  })

  const savedUser = await user.save()
  allUsers.push(savedUser)
  return savedUser
}

const resetCounters = () => {
  counters = {
    user: 0
  }
}

export {
  createUser,
  allUsers,

  resetCounters
}
