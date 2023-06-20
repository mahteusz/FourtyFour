import { Request, Response, NextFunction } from "express";
import ControllerError from "./types/ControllerError";
import ResponseError from "./types/ResponseError";

const errorMiddleware = (error: ControllerError, req: Request, res: Response, next: NextFunction) => {
  let responseError: ResponseError = {
    message: "General server error",
    status: 500
  }

  if(error.code === 11000) { //Duplicate field
    responseError.message = "Field already exists"
    responseError.status = 409
  }

  if(error.name === 'CastError') {
    responseError.message = "Resource not found"
    responseError.status = 404
  }

  res.status(responseError.status).json({error:responseError.message})
}

export default errorMiddleware