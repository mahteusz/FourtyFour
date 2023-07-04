import BcryptService from "../BcryptService"
import saltRounds from "../../config/encrypt"
import bcrypt from 'bcrypt'

const bcryptService = new BcryptService(saltRounds)

describe("Encryptation", () => {
  it('should encrypt the same as using Bcrypt directly', async () => {
    const string = "just-a-test"
    const serviceEncrypted = await bcryptService.encrypt(string)
    const encryptedDirectly = await bcrypt.hash(string, saltRounds)
    const serviceEncryptedResult = await bcrypt.compare(string, serviceEncrypted)
    const encryptedDirectlyResult = await bcrypt.compare(string, encryptedDirectly)
    expect(serviceEncryptedResult).toBe(encryptedDirectlyResult)
  })
})