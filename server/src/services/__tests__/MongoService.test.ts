import { ITest, TestModel, connect, disconnect, clearCollections } from "@helpers/mongodb-memory.server";
import MongoService from "@services/MongoService";
import { ObjectId } from "bson";


beforeAll(async() => await connect())
afterAll(async() => await disconnect())
const mongoService = new MongoService<ITest>(TestModel)

describe('Creating documents', () => {
  it('should create a document if everything is ok', async () => {
    const newTest = { stringField: 'simple-test', numberField: 0 } as ITest

    const test = await mongoService.create(newTest)
    expect(test._id).toBeInstanceOf(ObjectId)
    expect(test.stringField).toBe(newTest.stringField)
    expect(test.numberField).toBe(newTest.numberField)
    expect(test.optionalField).toBe(newTest.optionalField)
  })

  it('should throw an error if a required field is missing', async () => {
    const newTest = { stringField: 'simple-test' } as ITest

    expect(async () => await mongoService.create(newTest)).rejects.toThrow()
  })
})

describe('Updating documents', () => {
  let id: string

  beforeEach(async () => {
    const newTest = { stringField: 'simple-test', numberField: 0 } as ITest
    const testDoc = await mongoService.create(newTest)
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