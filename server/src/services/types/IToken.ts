import { UserPayload } from '@config/auth'

interface IToken {
  generate: (userPayload: UserPayload) => string,
  verify: (token: string) => UserPayload | null
}

export default IToken
