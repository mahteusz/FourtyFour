import { createUserTestDoc } from "@util/tests";
import { IUser } from "@models/types/index";
import supertest from "supertest";
import server from '../../'
import { authRoute } from "@config/routes";
import { JWTService } from "@services/index";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@util/secrets";
import { accessTokenTimeToExpire, refreshTokenTimeToExpire } from "@config/auth";
import { clearCollections } from "@helpers/mongodb-memory.server";

let testServer: typeof server
beforeAll(() => testServer = server)
afterAll(() => testServer.close())

describe('Login', () => {
  let userDoc: IUser
  let originalPassword: string

  beforeEach(async () => {
    const userData = await createUserTestDoc()
    userDoc = userData.doc
    originalPassword = userData.password
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return an access token when everything is ok', async () => {
    const response = await supertest(server.app).post(`${authRoute}/login`).send({
      username: userDoc.username,
      email: userDoc.email,
      password: originalPassword
    })
    const accessTokenService = new JWTService(JWT_ACCESS_SECRET!, accessTokenTimeToExpire)
    const refreshTokenService = new JWTService(JWT_REFRESH_SECRET!, refreshTokenTimeToExpire)
    expect(response.status).toBe(200)
    expect(response.body.data.accessToken).toBe(accessTokenService.generate({ user: userDoc._id }))
    expect(response.body.data.refreshToken).toBe(refreshTokenService.generate({ user: userDoc._id }))
  })

  it('should return an InvalidCredentials error if the provided username is not found', async () => {
    const response = await supertest(server.app).post(`${authRoute}/login`).send({
      username: 'username-not-registered',
      email: userDoc.email,
      password: originalPassword
    })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe("The provided credentials are invalid")
  })

  it('should return an InvalidCredentials error if the password is incorrect', async () => {
    const response = await supertest(server.app).post(`${authRoute}/login`).send({
      username: userDoc.username,
      email: userDoc.email,
      password: 'wrong-password'
    })
    expect(response.status).toBe(401)
    expect(response.body.error).toBe("The provided credentials are invalid")
  })
})