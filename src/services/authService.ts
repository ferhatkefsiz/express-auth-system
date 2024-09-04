import bcryptjs from "bcryptjs"
import UserModel from "../models/user.model"
import { RegisterDTO } from "../dtos/auth.dto"

export const userAlreadyExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email })
  return !!user
}

export const register = async (data: RegisterDTO): Promise<RegisterDTO> => {
  const hashedPassword = await bcryptjs.hash(data.password, 10)
  const exists = await userAlreadyExists(data.email)

  if (exists) {
    return Promise.reject(new Error("User already exists"))
  }

  const newUser = new UserModel({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    role: "user"
  })

  await newUser.save()

  return newUser.toObject()
}
