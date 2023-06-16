import { UserPayload } from '@config/auth'
import IToken from "./types/IToken";
import jwt from 'jsonwebtoken'

type JWTDefaultPayload = {
  iat: number
  exp: number
}

export default class JWTService implements IToken {
  private readonly secret: string
  private readonly timeToExpire: string

  constructor(secret: string, timeToExpire: string) {
    this.secret = secret
    this.timeToExpire = timeToExpire
  }

  public generate(userPayload: UserPayload): string {
    const token = jwt.sign(userPayload, this.secret, { expiresIn: this.timeToExpire })
    return token
  }

  public verify(token: string): UserPayload | null {
    try {
      const payload = jwt.verify(token, this.secret) as JWTDefaultPayload & UserPayload
      console.log(payload)
      const { iat, exp, ...userPayload } = payload
      return userPayload
    } catch {
      return null
    }
  }
}