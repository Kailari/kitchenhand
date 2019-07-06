import mongoose from 'mongoose'

// Helper to avoid having to explicitely add id:string to every document inteface
export interface DdObjectDocument extends mongoose.Document {
  id: string,
}
