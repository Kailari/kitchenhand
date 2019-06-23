const mongoose = require('mongoose')
const { allUsers } = require('./createRows')

const mongooseOptions = {
  autoIndex: false,
  autoReconnect: false,
  connectTimeoutMS: 10000,
  useNewUrlParser: true
}

const connectMongoose = async () => {
  jest.setTimeout(20000)
  return mongoose.connect(
    global.__MONGO_URI__,
    {
      ...mongooseOptions,
      dbName: global.__MONGO_DB_NAME,
    }
  )
}

const disconnectMongoose = async () => {
  await mongoose.disconnect()
}

const resetDatabase = async () => {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(() => { })
  }
  await mongoose.connection.db.dropDatabase()
  allUsers.length = 0
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__)
    .reduce(
      (prev, curr) => {
        return { ...prev, [curr]: 0 }
      },
      {})
}

module.exports = {
  connectMongoose,
  disconnectMongoose,
  resetDatabase,
}