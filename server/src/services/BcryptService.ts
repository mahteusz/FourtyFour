import IEncrypter from "./types/IEncrypter";
import bcrypt from 'bcrypt'

export default class BcryptService implements IEncrypter {
  private readonly saltRounds: number

  constructor(saltRounds: number) {
    this.saltRounds = saltRounds
  }

  public async encrypt(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, this.saltRounds)
    return hash
  }

  public async compare(text: string, hashedText: string): Promise<boolean> {
    const compared = await bcrypt.compare(text, hashedText)
    return compared
  }
}