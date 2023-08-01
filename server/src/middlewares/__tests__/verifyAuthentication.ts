import supertest from "supertest";
import server from '../../'
import { testRoute } from "@config/routes";
import { JWT_ACCESS_SECRET } from "@util/secrets";
import { accessTokenTimeToExpire } from "@config/auth";
import JWTService from "@services/JWTService";

let testServer: typeof server
beforeAll(() => testServer = server)
afterAll(() => testServer.close())

describe('Accessing a auth protected route', () => {
  it('should return an Unauthorized error when no token is provided', async () => {
    const response = await supertest(server.app).get(`${testRoute}/auth-protected`)
    expect(response.status).toBe(401)
    expect(response.body.error).toBe("User is not logged in")
  })

  it('should return an Unauthorized error when a invalid token is provided', async () => {
    const response = await supertest(server.app)
      .get(`${testRoute}/auth-protected`)
      .set('x-access-token', 'invalid')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe("User is not logged in")
  })

  it('should call set the "user" parameter on request when everything is ok', async () => {
    const tokenService = new JWTService(JWT_ACCESS_SECRET!, accessTokenTimeToExpire)
    const mockedUserId = 'user-id'
    const token = tokenService.generate({ user: mockedUserId })

    const response = await supertest(server.app)
    .get(`${testRoute}/auth-protected`)
    .set('x-access-token', token)

    expect(response.status).toBe(200)
    expect(response.body.data).toBe(mockedUserId)
  })
})