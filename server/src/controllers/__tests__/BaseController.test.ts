import supertest from "supertest";
import server from '../../'
import userRoute from "@config/routes";

let testServer: typeof server

beforeAll(() => testServer = server)
afterAll(() => testServer.close())