import bcryptjs from "bcryptjs"
import UserModel, { User } from "../models/user.model"
import { RegisterDTO } from "../dtos/auth.dto"

export const userAlreadyExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email })
  return !!user
}

export const register = async (data: RegisterDTO): Promise<User> => {
  const hashedPassword = await bcryptjs.hash(data.password, 10)
  const exists = await userAlreadyExists(data.email)

  if (exists) {
    return Promise.reject(new Error("User already exists"))
  }

  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

  const newUser = new UserModel({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    role: "user"
  })

  await newUser.save()

  return newUser.toObject()
}
