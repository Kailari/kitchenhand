import mongoose from 'mongoose'
import { MongoResource } from '../resources'

// Helpers for avoiding having to explicitely add id:string to every document inteface
export interface DdObjectDocument extends mongoose.Document, MongoResource {
  id: string,
}

export interface DdObjectSubDocument extends mongoose.Document, MongoResource {
  id: string,
}
