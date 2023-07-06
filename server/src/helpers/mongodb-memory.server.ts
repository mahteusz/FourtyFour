import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Schema, model, Document } from "mongoose";

let mongoDb: MongoMemoryServer

export interface ITest extends Document {
  stringField: string,
  numberField: number,
  optionalField: number
}

const TestSchema: Schema<ITest> = new Schema({
  stringField: {
    type: String,
    required: true
  },

  numberField: {
    type: Number,
    required: true
  },

  optionalField: {
    type: Number
  }
})

export const TestModel = model<ITest>("Test", TestSchema)

export const connect = async () => {
  mongoDb = await MongoMemoryServer.create()
  const uri = mongoDb.getUri()
  await mongoose.connect(uri)
}

export const disconnect = async () => {
  await clear()
  await mongoose.disconnect()
  await mongoDb.stop()
}

export const clearCollections = async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

export const clear = async () => {
  await mongoose.connection.db.dropDatabase();
}