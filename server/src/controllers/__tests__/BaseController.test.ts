import supertest from "supertest";
import server from '../../'
import { testRoute } from "@config/routes";

let testServer: typeof server

beforeAll(() => testServer = server)
afterAll(() => testServer.close())

describe('Testing get all route', () => {
  it('should return all Test documents', async () => {
    const response = await supertest(server.app).get(testRoute)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})