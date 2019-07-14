import mongoose from 'mongoose'

// Helpers for avoiding having to explicitely add id:string to every document inteface
export interface DdObjectDocument extends mongoose.Document {
  id: string,
}

export interface DdObjectSubDocument extends mongoose.Document {
  id: string,
}
