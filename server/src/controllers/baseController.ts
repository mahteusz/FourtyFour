import { IBaseController } from "./types/IBaseController";
import { Request, Response, NextFunction } from "express"
import { IRepository } from "../services/types/IRepository";
import { Model } from "mongoose";

export class BaseController<T> implements IBaseController<T> {
  private readonly repository: IRepository<T>

  constructor(repository: IRepository<T>) {
    this.repository = repository
  }

  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newResource = new Model<T>(req.body)
    const foundResource = await this.repository.findOne(req.body.id)
    if (foundResource) {
      res.status(409).json({ message: "Resource already exists" })
      return
    }

    const resource = await this.repository.create(newResource)
    res.status(201).json({ data: resource })
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const resources = await this.repository.find()
    if (resources.length === 0) {
      res.status(404).json({ message: "Resources not found" })
      return
    }

    res.status(200).json({ data: resources })
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const resource = await this.repository.findOne(req.body.id)
    if (!resource) {
      res.status(404).json({ message: "Resource not found" })
      return
    }

    res.status(200).json({ data: resource })
  }

  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    const resource = new Model<T>(req.body)
    const updated = await this.repository.update(req.body.id, resource)
    if(!updated){
      res.status(204).json({ message: "No resource was updated" })
    }

    res.status(200).json({ message: "Resource updated successfully" })
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const deleted = await this.repository.delete(req.body.id)
    if (!deleted) {
      res.status(204).json({ message: "No resource was deleted" })
    }

    res.status(200).json({ message: "Resource deleted successfully" })
  }
}