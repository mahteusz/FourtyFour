import { Model, isValidObjectId } from "mongoose";
import { IRepository } from "./types/IRepository";
export class MongoService<T extends Model<any>> implements IRepository<T> {
  private readonly model

  constructor(model: T){
    this.model = model
  }

  async create(item: T): Promise<T> {
    const newDocument = (await this.model.create(item)).save()
    return newDocument
  }

  async update(id: string, item: Partial<T>): Promise<Boolean> {
    if(!isValidObjectId(id)) return false

    const updated = await this.model.updateOne({ _id: id }, item)
    return updated.modifiedCount >= 1
  }

  async delete(id: string): Promise<Boolean> {
    if(!isValidObjectId(id)) return false

    const deleted = await this.model.deleteOne({ _id: id }).exec()
    return deleted.deletedCount === 1
  }

  async find(): Promise<T[]> {
    const documents = await this.model.find()
    return documents
  }

  async findOne(id: string): Promise<T | null> {
    if(!isValidObjectId(id)) return null

    const document = await this.model.findById(id)
    return document

  }
}