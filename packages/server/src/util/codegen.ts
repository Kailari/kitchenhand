import mongoose from 'mongoose'
import { MongoResource } from '../resources/mongoResource'

// Helpers for avoiding having to explicitely add id:string to every document inteface
export interface DdObjectDocument extends mongoose.Document, MongoResource {
  id: ID,
}

export interface DdObjectSubDocument extends mongoose.Document, MongoResource {
  id: ID,
}
