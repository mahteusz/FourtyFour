import { Request, Response, NextFunction } from "express"

export interface IBaseController {
  post(req: Request, res: Response, next: NextFunction): Promise<void>
  get(req: Request, res: Response, next: NextFunction): Promise<void>
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>
  patch(req: Request, res: Response, next: NextFunction): Promise<void>
  delete(req: Request, res: Response, next: NextFunction): Promise<void>
}