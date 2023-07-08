import { ITest, TestModel } from "@helpers/mongodb-memory.server"
import MongoService from "@services/MongoService"

export const createTestDoc = async () => {
  const mongoService = new MongoService<ITest>(TestModel)
  const newTest = { stringField: 'test', numberField: 123 } as ITest
  const testDoc = await mongoService.create(newTest)
  return testDoc
}