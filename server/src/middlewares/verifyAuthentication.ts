import JWTService from "@services/JWTService";
import { NextFunction, Request, Response } from "express";
import { accessTokenTimeToExpire } from "@config/auth";
import { JWT_ACCESS_SECRET } from "@util/secrets";
import { CustomRequest } from "./types";

const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  const tokenService = new JWTService(JWT_ACCESS_SECRET!, accessTokenTimeToExpire)
  const token = req.headers['x-access-token'] as string
  const verified = tokenService.verify(token)
  if (!verified) {
    return next({ name: "Unauthorized" })
  }

  (req as CustomRequest).user = verified.user
  next()
}

export default verifyAuthentication