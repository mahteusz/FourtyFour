import { Model } from "mongoose";
import IRepository from "./types/IRepository";
export default class MongoService<T> implements IRepository<T> {
  private readonly model: Model<T>

  constructor(model: Model<T>){
    this.model = model
  }

  async create(item: T): Promise<T> {
    const newDocument = new this.model(item)
    await newDocument.save()
    return newDocument
  }

  async update(id: string, item: Partial<T>): Promise<Boolean> {

    const updated = await this.model.updateOne({ _id: id }, item)
    const doc = await this.model.findById(id)
    doc?.save()
    return updated.modifiedCount >= 1
  }

  async delete(id: string): Promise<Boolean> {

    const deleted = await this.model.deleteOne({ _id: id })
    return deleted.deletedCount === 1
  }

  async find(): Promise<T[]> {
    const documents = await this.model.find()
    return documents
  }

  async findOne(id: string): Promise<T | null> {

    const document = await this.model.findById(id)
    return document

  }
}