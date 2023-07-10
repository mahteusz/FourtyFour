import { createUserTestDoc } from "@util/tests";
import IUser from "@models/types/IUser";
import supertest from "supertest";
import server from '../../'
import { authRoute } from "@config/routes";
import JWTService from "@services/JWTService";
import { JWT_SECRET } from "@util/secrets";
import { accessTokenTimeToExpire } from "@config/auth";
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
    const tokenService = new JWTService(JWT_SECRET!, accessTokenTimeToExpire)
    expect(response.status).toBe(200)
    expect(response.body.data).toBe(tokenService.generate({ user: userDoc._id }))
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