import { Schema, Model, model } from "mongoose";
import { IUser } from "../types/IUser";

export const userSchema: Schema = new Schema({
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

export const User: Model<IUser> = model<IUser>("User", userSchema);