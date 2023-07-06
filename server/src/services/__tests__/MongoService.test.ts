import { ITest, TestModel, connect, disconnect } from "@helpers/mongodb-memory.server";
import MongoService from "@services/MongoService";
import { ObjectId } from "bson";


beforeAll(connect)
afterAll(disconnect)
const mongoService = new MongoService<ITest>(TestModel)

describe('Creating documents', () => {
  it('should create a document if everything is ok', async () => {
    const newTest = {
      stringField: 'simple-test',
      numberField: 0,
    } as ITest

    const test = await mongoService.create(newTest)
    expect(test._id).toBeInstanceOf(ObjectId)
    expect(test.stringField).toBe(newTest.stringField)
    expect(test.numberField).toBe(newTest.numberField)
    expect(test.optionalField).toBe(newTest.optionalField)
  })

  it('should throw an error if a required field is missing', async () => {
    const newTest = {
      stringField: 'simple-test',
    } as ITest

    expect(async () => await mongoService.create(newTest)).rejects.toThrow()
  })
})