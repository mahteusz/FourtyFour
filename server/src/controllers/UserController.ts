import { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_SECRET } from "@util/secrets";
import { JWTService } from "@services/index";
import { IUser } from "@models/types/index";
import { accessTokenTimeToExpire, refreshTokenTimeToExpire } from "@config/auth";
import BaseController from "./baseController";
export default class UserController extends BaseController<IUser>{

  public post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newUser = await this.repository.create({ ...req.body })
      const accessTokenService = new JWTService(JWT_ACCESS_SECRET!, accessTokenTimeToExpire)
      const refreshTokenService = new JWTService(JWT_ACCESS_SECRET!, refreshTokenTimeToExpire)
      const accessToken = accessTokenService.generate({ user: newUser._id })
      const refreshToken = refreshTokenService.generate({ user: newUser._id })

      res.status(200).json({ data: { accessToken, refreshToken } })

    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
