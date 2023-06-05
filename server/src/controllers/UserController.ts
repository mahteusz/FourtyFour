import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../util/secrets";
import { JWTService } from "../services/JWTService";
import { User } from "../models/User";
import { accessTokenTimeToExpire } from "../config/auth";

export class UserController {

  public async register(req: Request, res: Response): Promise<void> {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })

    const tokenService = new JWTService(JWT_SECRET!, accessTokenTimeToExpire)
    let token = tokenService.generate({user: newUser._id})
    res.status(200).json({token: token})
  }
}
