import NodeEnvironment from 'jest-environment-node'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Script } from 'vm'

declare global {
  namespace NodeJS {
    interface Global {
      MONGO_URI: string;
      MONGO_DB_NAME: string;
      MONGOD: MongoMemoryServer;
    }
  }
}

class MongoDbEnvironment extends NodeEnvironment {
  mongod: MongoMemoryServer

  constructor(config: any) {
    super(config)
    this.mongod = new MongoMemoryServer({
      instance: {
      },
      binary: {
        version: '3.6.1',
      },
    })
  }
  
  async setup() {
    await super.setup()
    this.global.MONGO_URI = await this.mongod.getConnectionString()
    this.global.MONGO_DB_NAME = await this.mongod.getDbName()
  }

  async teardown() {
    await super.teardown()
    await this.mongod.stop()
  }

  runScript(script: Script) {
    return super.runScript(script)
  }
}

export default MongoDbEnvironment
