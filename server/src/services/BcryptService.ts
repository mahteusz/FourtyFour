import { IEncrypter } from "./types/IEncrypter";
import bcrypt from 'bcrypt'

export class BcryptService implements IEncrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  public async encrypt(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, this.salt)
    return hash
  }

  public async compare(text: string, hashedText: string): Promise<boolean> {
    const compared = await bcrypt.compare(text, hashedText)
    return compared
  }
}