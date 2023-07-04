import BcryptService from "@services/BcryptService"
import saltRounds from "@config/encrypt"
import bcrypt from 'bcrypt'

const bcryptService = new BcryptService(saltRounds)
const generateRandomString = () => {
  return Math.random().toString(36)
}

describe("Encryptation", () => {
  it('should encrypt the same as using Bcrypt directly', async () => {
    const randomString = generateRandomString()
    const serviceEncrypted = await bcryptService.encrypt(randomString)
    const encryptedDirectly = await bcrypt.hash(randomString, saltRounds)
    const serviceEncryptedResult = await bcrypt.compare(randomString, serviceEncrypted)
    const encryptedDirectlyResult = await bcrypt.compare(randomString, encryptedDirectly)
    expect(serviceEncryptedResult).toBe(encryptedDirectlyResult)
  })
})

describe('Comparing', () => {
  it('should return true when the encrypted text and text are equal', async() => {
    const randomString = generateRandomString()
    const encrypted = await bcryptService.encrypt(randomString)
    const comparing = await bcryptService.compare(randomString, encrypted)
    expect(comparing).toBe(true)
  })

  it('should return false when the encrypted text and text are different', async () => {
    const randomString = generateRandomString()
    const encrypted = await bcryptService.encrypt(randomString)
    const comparing = await bcryptService.compare("a-different-random-string", encrypted)
    expect(comparing).toBe(false)
  })
})