import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { UnitDbObject } from '../generated/graphql'
import { DdObjectDocument } from '../util/codegen'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 64
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 16
  },
})
schema.plugin(uniqueValidator)

export interface IUnit extends DdObjectDocument, UnitDbObject {}

export default mongoose.model<IUnit>('Unit', schema)
