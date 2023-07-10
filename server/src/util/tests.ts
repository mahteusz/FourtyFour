import { ITest, TestModel } from "@helpers/mongodb-memory.server"
import IUser from "@models/types/IUser"
import UserModel from "@models/user"
import MongoService from "@services/MongoService"

export const createTestDoc = async () => {
  const mongoService = new MongoService<ITest>(TestModel)
  const newTest = { stringField: 'test', numberField: 123 } as ITest
  const testDoc = await mongoService.create(newTest)
  return testDoc
}

export const createUserTestDoc = async () => {
  const mongoService = new MongoService<IUser>(UserModel)
  const cleanPassword = 'pass1234'
  const newUserTest = { 
    username: 'username', password: cleanPassword, email: 'test@mail.com'
   } as IUser
  const userDoc = await mongoService.create(newUserTest)
  return {
    password: cleanPassword,
    doc: userDoc
  }
}