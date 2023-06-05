import { UserPayload } from '../../config/auth'

export interface IToken {
  generate: (userPayload: UserPayload) => string,
  verify: (token: string) => UserPayload | null
}
