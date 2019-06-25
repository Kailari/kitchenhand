import mongoose from 'mongoose';
import { allUsers, resetCounters } from './createRows'
import { MongoMemoryServer } from 'mongodb-memory-server'

declare global {
  namespace NodeJS {
    interface Global {
      MONGO_URI: string
      MONGO_DB_NAME: string
      MONGOD: MongoMemoryServer
    }
  }
}

const mongooseOptions = {
  autoIndex: false,
  autoReconnect: false,
  connectTimeoutMS: 10000,
  useNewUrlParser: true
}

export const connectMongoose = async () => {
  jest.setTimeout(20000)
  return mongoose.connect(
    global.MONGO_URI,
    {
      ...mongooseOptions,
      dbName: global.MONGO_DB_NAME,
    }
  )
}

export const disconnectMongoose = async () => {
  await mongoose.disconnect()
}

export const resetDatabase = async () => {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(() => { })
  }
  await mongoose.connection.db.dropDatabase()
  allUsers.length = 0
  resetCounters()
}
