import { Request, Response, NextFunction } from "express";
import ControllerError from "./types/ControllerError";
import ResponseError from "./types/ResponseError";

const allErrors: { [key: string]: ResponseError } = {
  "CastError": { message: "Resource not found", status: 404 },
  "EmptyRequest": { message: "Empty body", status: 422 },
  "NotFound": { message: "Resource not found", status: 404 },
  "ValidationError": { message: "Validation failed", status: 400 }
}

const errorMiddleware = (error: ControllerError, req: Request, res: Response, next: NextFunction) => {
  let responseError: ResponseError = {
    message: "General server error",
    status: 500
  }

  if (error.code === 11000) { //Duplicate field
    responseError.message = "Field already exists"
    responseError.status = 409
  } else {
    if (Object.keys(allErrors).includes(error.name)) {
      responseError = allErrors[error.name]
    }
  }

  res.status(responseError.status).json({ error: responseError.message })
}

export default errorMiddleware