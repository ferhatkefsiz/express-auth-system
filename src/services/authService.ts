import bcryptjs from "bcryptjs"
import crypto from "crypto"
import UserModel, { User } from "../models/user.model"
import { RegisterDTO } from "../dtos/auth.dto"
import {
  sendVerificationEmail,
  sendWelcomeOnboardEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
} from "../utils/email"

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

  await sendVerificationEmail({
    name: data.name,
    email: data.email,
    verificationCode: verificationToken
  })

  return newUser.toObject()
}

export const verifyEmail = async (verificationCode: string): Promise<User> => {
  const user = await UserModel.findOne({ verificationToken: verificationCode })

  if (!user) {
    return Promise.reject(new Error("Invalid verification code"))
  }

  user.isVerified = true
  user.verificationToken = undefined
  user.verificationTokenExpiresAt = undefined

  await user.save()
  await sendWelcomeOnboardEmail({ email: user.email, name: user.name })

  return user.toObject()
}

export const login = async (email: string, password: string): Promise<User> => {
  const user = await UserModel.findOne({ email })

  if (!user) {
    return Promise.reject(new Error("User not found"))
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password)

  if (!isPasswordValid) {
    return Promise.reject(new Error("Invalid credentials"))
  }

  user.lastLogin = new Date()
  await user.save()

  return user.toObject()
}

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new Error("User not found")
  }

  const resetToken = crypto.randomBytes(20).toString("hex")
  const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

  user.resetPasswordToken = resetToken
  user.resetPasswordTokenExpiresAt = new Date(resetTokenExpiresAt)

  await user.save()

  await sendPasswordResetEmail({
    email: user.email,
    resetURL: `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
  })
}

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiresAt: { $gt: Date.now() }
  })

  if (!user) {
    throw new Error("Invalid or expired reset token")
  }

  const hashedPassword = await bcryptjs.hash(password, 10)
  user.password = hashedPassword

  user.resetPasswordToken = undefined
  user.resetPasswordTokenExpiresAt = undefined

  await user.save()
  await sendResetSuccessEmail({ email: user.email })
}
