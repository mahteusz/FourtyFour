import supertest from "supertest";
import server from '../../'
import { testRoute } from "@config/routes";
import { clearCollections } from "@helpers/mongodb-memory.server";
import { createTestDoc } from "@util/tests";
import { ITest } from "@helpers/mongodb-memory.server";

let testServer: typeof server

beforeAll(() => testServer = server)
afterAll(() => testServer.close())

describe('POST in /', () => {
  it('should create a Test document if everything is ok', async () => {
    const response = await supertest(server.app).post(testRoute).send({
      stringField: 'test',
      numberField: 123
    })
    const doc = response.body.data
    expect(response.status).toBe(201)
    expect(doc.stringField).toBe('test')
    expect(doc.numberField).toBe(123)
    expect(doc._id).not.toBeNull()
  })

  it('should return a ValidationError if some required field is missing', async () => {
    const response = await supertest(server.app).post(testRoute).send({})
    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Validation failed")
  })
})

describe('GET in /', () => {
  let testDoc: ITest

  beforeEach(async () => {
    testDoc = await createTestDoc()
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return all Test documents if everything is ok', async () => {
    const response = await supertest(server.app).get(testRoute)
    const doc = response.body.data[0]
    expect(response.status).toBe(200)
    expect(doc.stringField).toBe(testDoc.stringField)
    expect(doc.numberField).toBe(testDoc.numberField)
    expect(doc._id).not.toBeNull()
  })
})

describe('GET in /:id', () => {
  let testDoc: ITest

  beforeEach(async () => {
    testDoc = await createTestDoc()
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return the correct Test document if everything is ok', async () => {
    const response = await supertest(server.app).get(`${testRoute}/${testDoc._id}`)
    const doc = response.body.data
    expect(response.status).toBe(200)
    expect(doc.stringField).toBe(testDoc.stringField)
    expect(doc.numberField).toBe(testDoc.numberField)
    expect(doc._id).toBe(String(testDoc._id))
  })

  it('should return a NotFoundError if id is not found/invalid', async () => {
    const response = await supertest(server.app).get(`${testRoute}/not-found-id`)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe("Resource not found")
  })
})

describe("PATCH in /:id", () => {
  let testDoc: ITest

  beforeEach(async () => {
    testDoc = await createTestDoc()
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should update the document if everything is ok', async () => {
    const response = await supertest(server.app).patch(`${testRoute}/${testDoc._id}`).send({
      stringField: 'new-string-field'
    })
    const getResponse = await supertest(server.app).get(`${testRoute}/${testDoc._id}`)
    const doc = getResponse.body.data
    expect(response.status).toBe(204)
    expect(doc.stringField).toBe('new-string-field')
    expect(doc.numberField).toBe(testDoc.numberField)
    expect(doc._id).toBe(String(testDoc._id))
  })

  it('should return an EmptyRequestError if the request has an empty body', async () => {
    const response = await supertest(server.app).patch(`${testRoute}/${testDoc._id}`).send({})
    expect(response.status).toBe(422)
    expect(response.body.error).toBe('Empty body')
  })

  it('should return a NotFoundError if id is not found/invalid', async () => {
    const response = await supertest(server.app).patch(`${testRoute}/not-found-id`).send({
      stringField: 'new-string-field'
    })
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Resource not found')
  })
})

describe('DELETE on /:id', () => {
  let testDoc: ITest

  beforeEach(async () => {
    testDoc = await createTestDoc()
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should delete the specified doc if everything is ok', async () => {
    const response = await supertest(server.app).delete(`${testRoute}/${testDoc._id}`)
    const getDeleted = await supertest(server.app).get(`${testRoute}/${testDoc._id}`)
    expect(response.status).toBe(204)
    expect(getDeleted.status).toBe(404)
  })

  it('should return an NotFoundError if id is not found/invalid', async () => {
    const response = await supertest(server.app).delete(`${testRoute}/'not-found-id'`)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Resource not found')
  })
})