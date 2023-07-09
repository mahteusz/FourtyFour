import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@util/secrets";
import IUser from "@models/types/IUser";
import IRepository from "@services/types/IRepository";
import IEncrypter from "@services/types/IEncrypter";
import IToken from "@services/types/IToken";

export default class AuthController {
  private readonly repository: IRepository<IUser>
  private readonly encrypter: IEncrypter
  private readonly tokenService: IToken

  constructor(repository: IRepository<IUser>, encrypter: IEncrypter, tokenService: IToken) {
    this.repository = repository
    this.encrypter = encrypter
    this.tokenService = tokenService
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    const user = await this.repository.findOneFilteringBy({ username: username })
    if (!user) return next({ name: "InvalidCredentials" })

    const isPasswordEqual = await this.encrypter.compare(password, user.password)
    if (!isPasswordEqual) return next({ name: "InvalidCredentials" })

    const token = this.tokenService.generate({ user: user._id })
    res.status(200).send({ data: token })
  }
}
