import JWTService from "@services/JWTService";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@util/secrets";
import { UserPayload } from "@config/auth";

const jwtService = new JWTService(JWT_SECRET!, "1s")
const userPayload: UserPayload = {
  user: "test"
}

describe('Token generation', () => {
  it('should generate a user token the same as using JWT directly', () => {
    const jwtServiceToken = jwtService.generate(userPayload)
    const generatedDirectly = jwt.sign(userPayload, JWT_SECRET!, { expiresIn: "1s" })
    expect(jwt.decode(jwtServiceToken)).toEqual(jwt.decode(generatedDirectly))
  })
})

describe('Token verification', () => {
  it('should return a UserPayload if the token is correct', () => {
    const token = jwtService.generate(userPayload)
    const payload = jwtService.verify(token)
    expect(payload).toEqual(userPayload)
  })

  it('should return null when the token was modified', () => {
    let token = jwtService.generate(userPayload)
    token += "some-information"
    const payload = jwtService.verify(token)
    expect(payload).toBe(null)
  })

  it('should return null when the token is expired', () => {
    jest.useFakeTimers()
    const token = jwtService.generate(userPayload)
    let payload: UserPayload | null = userPayload
    setTimeout(() => { payload = jwtService.verify(token) }, 1000)
    jest.advanceTimersByTime(1000)
    expect(payload).toBe(null)
  })
})