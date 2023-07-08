export type UserPayload = {
  user: string
}

console.log(process.env.NODE_ENV)
export const accessTokenTimeToExpire = "5m"
export const refreshTokenTimeToExpire = "1d"