import { Request, Response } from "express"
import { RegisterDTO } from "../dtos/auth.dto"
import * as AuthService from "../services/authService"
import { generateToken, setTokenCookie } from "../utils/authToken"

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: RegisterDTO = req.body

    if (!data.email || !data.password || !data.name) {
      throw new Error("Missing required fields")
    }

    const user = await AuthService.register(data)

    const token = generateToken({ id: user._id, email: user.name })
    setTokenCookie(res, token)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    res.status(400).json({
      message: "User registration failed",
      error: errorMessage
    })
  }
}

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { verificationCode }: { verificationCode: string } = req.body

    if (!verificationCode) {
      throw new Error("Missing verification code")
    }

    const user = await AuthService.verifyEmail(verificationCode)

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    res.status(400).json({
      message: "Email verification failed",
      error: errorMessage
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body

    if (!email || !password) {
      throw new Error("Missing email or password")
    }

    const user = await AuthService.login(email, password)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const token = generateToken({ id: user._id, email: user.name })
    setTokenCookie(res, token)

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    res.status(400).json({
      message: "Login failed",
      error: errorMessage
    })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("authToken")

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}
