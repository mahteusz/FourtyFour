import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../util/secrets";
import { JWTService } from "../services/JWTService";
import User from "../models/user";
import { accessTokenTimeToExpire } from "../config/auth";
import { BaseController } from "./baseController";
import { IRepository } from "../services/types/IRepository";
export class UserController extends BaseController<typeof User>{

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
