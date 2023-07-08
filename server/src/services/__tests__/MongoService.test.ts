import { ITest, TestModel, connect, disconnect, clearCollections } from "@helpers/mongodb-memory.server";
import MongoService from "@services/MongoService";
import { ObjectId } from "bson";
import { createTestDoc } from "@util/tests";

beforeAll(async () => await connect())
afterAll(async () => await disconnect())
const mongoService = new MongoService<ITest>(TestModel)

describe('Creating documents', () => {
  it('should create a document if everything is ok', async () => {
    const newTest = { stringField: 'simple-test', numberField: 0 } as ITest

    const doc = await mongoService.create(newTest)
    expect(doc._id).toBeInstanceOf(ObjectId)
    expect(doc.stringField).toBe(newTest.stringField)
    expect(doc.numberField).toBe(newTest.numberField)
    expect(doc.optionalField).toBe(newTest.optionalField)
  })

  it('should throw an error if a required field is missing', async () => {
    const newTest = { stringField: 'simple-test' } as ITest

    expect(async () => await mongoService.create(newTest)).rejects.toThrow()
  })
})

describe('Updating documents', () => {
  let id: string

  beforeEach(async () => {
    const testDoc = await createTestDoc()
    id = testDoc._id
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return true and update the document if everything is ok', async () => {
    const updated = await mongoService.update(id, { stringField: 'updated' })
    expect(updated).toBe(true)
  })

  it('should return false and not update the document if id is not found/invalid', async () => {
    const updated = await mongoService.update("not-found-id", { stringField: 'updated' })
    expect(updated).toBe(false)
  })
})

describe('Deleting documents', () => {
  let id: string
  beforeEach(async () => {
    const testDoc = await createTestDoc()
    id = testDoc._id
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return true and delete the document if everything is ok', async () => {
    const deleted = await mongoService.delete(id)
    expect(deleted).toBe(true)
  })

  it('should return false and not delete the document if id is not found/invalid', async () => {
    const deleted = await mongoService.delete("not-found-id")
    expect(deleted).toBe(false)
  })
})

describe('Reading documents', () => {
  let id: string
  beforeEach(async () => {
    const testDoc = await createTestDoc()
    id = testDoc._id
  })

  afterEach(async () => {
    await clearCollections()
  })

  it('should return an array with all documents if everything is ok', async () => {
    const docs = await mongoService.find()
    expect(docs).toHaveLength(1)
  })

  it('should return a doc if everything is ok', async () => {
    const doc = await mongoService.findOne(id)
    expect(doc).not.toBeNull()
  })

  it('should return null if id is not found/invalid', async () => {
    const doc = await mongoService.findOne('not-found-id')
    expect(doc).toBeNull()
  })
})