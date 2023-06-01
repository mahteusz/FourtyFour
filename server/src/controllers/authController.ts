import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../util/secrets";

export class AuthController {

  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'] as string
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    jwt.verify(token, JWT_SECRET!)

  }
}
