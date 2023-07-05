import { connect, disconnect } from "@helpers/mongodb-memory.server";
import IUser from "@models/types/IUser";
import UserModel from "@models/user";
import BcryptService from "@services/BcryptService";
import MongoService from "@services/MongoService";
import { ObjectId } from "bson";


beforeAll(connect)
afterAll(disconnect)
const mongoService = new MongoService<IUser>(UserModel)

describe('Creating documents', () => {
  it('should create a document if everything is ok', async () => {
    const newUserData = {
      username: "username",
      email: "email@test.com",
      password: "pass1234"
    } as IUser
    const newUser = await mongoService.create(newUserData)
    const bcryptService = new BcryptService(1)
    const isPasswordEncrypted = await bcryptService.compare(newUserData.password, newUser.password)
    expect(newUser._id).toBeInstanceOf(ObjectId)
    expect(newUser.__v).toEqual(0)
    expect(newUser.username).toEqual(newUserData.username)
    expect(newUser.email).toEqual(newUserData.email)
    expect(isPasswordEncrypted).toBe(true)
  })

  it('should throw an error if fields are missing', async () => {
    const newUserData = {
      username: "username",
    } as IUser
    expect(async () => await mongoService.create(newUserData)).rejects.toThrow() 
  })
})
