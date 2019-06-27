import mongoose from 'mongoose'
import { allUsers, resetCounters } from './createRows'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      MONGO_URI: string,
      MONGO_DB_NAME: string,
    }
  }
}

const mongooseOptions = {
  autoIndex: false,
  autoReconnect: false,
  connectTimeoutMS: 10000,
  useNewUrlParser: true
}

export const connectMongoose = async (): Promise<typeof mongoose> => {
  jest.setTimeout(20000)
  return mongoose.connect(
    global.MONGO_URI,
    {
      ...mongooseOptions,
      dbName: global.MONGO_DB_NAME,
    }
  )
}

export const disconnectMongoose = async (): Promise<void> => {
  await mongoose.disconnect()
}

export const resetDatabase = async (): Promise<void> => {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany((): void => { })
  }
  await mongoose.connection.db.dropDatabase()
  allUsers.length = 0
  resetCounters()
}
