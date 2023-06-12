import { IBaseController } from "./types/IBaseController";
import { Request, Response, NextFunction } from "express"
import { IRepository } from "../services/types/IRepository";
import { Model } from "mongoose";

export class BaseController<T> implements IBaseController {
  private readonly repository: IRepository<T>

  constructor(repository: IRepository<T>) {
    this.repository = repository
  }

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newResource = new Model<T>(req.body)
    const resource = await this.repository.create(newResource)
    res.status(201).json({ data: resource })
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resources = await this.repository.find()
    if (resources.length === 0) {
      res.status(404).json({ message: "Resources not found" })
      return
    }

    res.status(200).json({ data: resources })
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resource = await this.repository.findOne(req.params.id)
    if (!resource) {
      res.status(404).json({ message: "Resource not found" })
      return
    }

    res.status(200).json({ data: resource })
  }

  patch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const updated = await this.repository.update(req.params.id, req.body)
    if(!updated){
      res.status(204).json({ message: "No resource was updated" })
    }

    res.status(200).json({ message: "Resource updated successfully" })
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const deleted = await this.repository.delete(req.params.id)
    if (!deleted) {
      res.status(204).json({ message: "No resource was deleted" })
    }

    res.status(200).json({ message: "Resource deleted successfully" })
  }
}