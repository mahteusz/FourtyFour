import { Request, Response } from "express";
import { JWT_SECRET } from "../util/secrets";
import { JWTService } from "../services/JWTService";
import IUser from "../models/types/IUser";
import { accessTokenTimeToExpire, refreshTokenTimeToExpire } from "../config/auth";
import { BaseController } from "./baseController";
import { BcryptService } from "../services/BcryptService";
import { saltRounds } from "../config/encrypt";
export class UserController extends BaseController<IUser>{

  public post = async (req: Request, res: Response): Promise<void> => {
    const accessTokenService = new JWTService(JWT_SECRET!, accessTokenTimeToExpire)
    const refreshTokenService = new JWTService(JWT_SECRET!, refreshTokenTimeToExpire)
    const encryptService = new BcryptService(saltRounds)
    
    const password = req.body.password
    const hashedPassword = await encryptService.encrypt(password)

    const newUser = await this.repository.create({...req.body, password: hashedPassword, })

    const accessToken = accessTokenService.generate({user: newUser._id})
    const refreshToken = refreshTokenService.generate({user: newUser._id})
    res.status(200).json({accessToken, refreshToken})
  }
}
