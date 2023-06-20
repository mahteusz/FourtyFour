import { Request, Response, NextFunction } from "express";
import HttpError from "./HttpError";

const errorMiddleware = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500
  const message = error.message || 'General server error'

  res.status(status).json({"message": message})
}

export default errorMiddleware