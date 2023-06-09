import { Model } from "mongoose";
import { IRepository } from "./types/IRepository";
import User from "../models/User";

export class MongoService<T extends Model<any>> implements IRepository<T> {
  private readonly model

  constructor(bosta: T){
    this.model = bosta
  }

  test = () => {
    console.log(typeof this.model, this.model)
  }

  async create(item: T): Promise<T> {
    const newDocument = (await this.model.create(item)).save()
    return newDocument
  }

  async update(id: string, item: Partial<T>): Promise<Boolean> {
    const updated = await this.model.updateOne({ _id: id }, item)
    return updated.modifiedCount >= 1
  }

  async delete(id: string): Promise<Boolean> {
    console.log(this.model)
    const deleted = await this.model.deleteOne({ _id: id }).exec()
    return deleted.deletedCount === 1
  }

  async find(): Promise<T[]> {
    console.log(this.model.modelName)
    console.log(this.model)
    const documents = await this.model.find()
    return documents
  }

  async findOne(id: string): Promise<T | null> {
    const document = await this.model.findById(id)
    return document

  }
}