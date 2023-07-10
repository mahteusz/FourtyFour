import { Schema, model } from "mongoose";
import IUser from "./types/IUser";
import { BcryptService } from "@services/index";
import saltRounds from "@config/encrypt";

export const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,

  },
  email: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true });

userSchema.pre("save", async function (this: IUser, next) {
  const encryptService = new BcryptService(saltRounds)
  this.password = await encryptService.encrypt(this.password)
  next()
})

const UserModel = model<IUser>("User", userSchema)

export default UserModel