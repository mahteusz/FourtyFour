import { Request, Response } from "express";
import { JWT_SECRET } from "../util/secrets";
import { JWTService } from "../services/JWTService";
import IUser from "../models/types/IUser";
import { accessTokenTimeToExpire, refreshTokenTimeToExpire } from "../config/auth";
import { BaseController } from "./baseController";
export class UserController extends BaseController<IUser>{

  public post = async (req: Request, res: Response): Promise<void> => {
    const newUser = await this.repository.create(req.body)

    const accessTokenService = new JWTService(JWT_SECRET!, accessTokenTimeToExpire)
    const refreshTokenService = new JWTService(JWT_SECRET!, refreshTokenTimeToExpire)
    const accessToken = accessTokenService.generate({user: newUser._id})
    const refreshToken = refreshTokenService.generate({user: newUser._id})
    res.status(200).json({accessToken, refreshToken})
  }
}
