import IBaseController from "./types/IBaseController";
import { Request, Response, NextFunction } from "express"
import IRepository from "@services/types/IRepository";
export default class BaseController<T> implements IBaseController {
  protected readonly repository: IRepository<T>

  constructor(repository: IRepository<T>) {
    this.repository = repository
  }

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await this.repository.create(req.body)
      res.status(201).json({ data: resource })
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const resources = await this.repository.find()
    res.status(200).json({ data: resources })
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resource = await this.repository.findOne(req.params.id)
      if(!resource)
        next({ name:"NotFound" })
      res.status(200).json({ data: resource })

    } catch (error) {
      next(error)
    }
  }

  patch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (Object.keys(req.body).length === 0) {
      next({ name: "EmptyRequest" })
      return
    }

    try {
      const updated = await this.repository.update(req.params.id, req.body)
      if (!updated)
        next({ name: "NotFound" })
      res.status(204).json({})

    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.repository.delete(req.params.id)
      if (!deleted)
        next({ name: "NotFound" })
        res.status(204).json({})
    } catch(error) {
      next(error)
    }
  }
}