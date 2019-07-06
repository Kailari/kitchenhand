import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { UserDbObject } from '../generated/graphql'
import { DdObjectDocument } from '../util/codegen'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 64
  },
  loginname: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 32
  },
  password: {
    type: String,
    required: true,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  ]
})
schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (document, returnedObject): void => {
    delete returnedObject.password
  }
})

export interface IUser extends DdObjectDocument, UserDbObject {}

export default mongoose.model<IUser>('User', schema)
