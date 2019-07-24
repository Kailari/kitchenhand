import mongoose from 'mongoose'
import { IMongoResource } from '../resources'

// Helpers for avoiding having to explicitely add id:string to every document inteface
export interface DdObjectDocument extends mongoose.Document, IMongoResource {
  id: string,
}

export interface DdObjectSubDocument extends mongoose.Document, IMongoResource {
  id: string,
}
