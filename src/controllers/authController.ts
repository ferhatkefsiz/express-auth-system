import { Request, Response } from "express"
import { RegisterDTO } from "../dtos/auth.dto"
import * as AuthService from "../services/authService"
import { generateToken, setTokenCookie } from "../utils/authToken"
import { handleError } from "../utils/errorHandler"

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
    handleError(res, error, 400, "User registration failed")
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
    handleError(res, error, 400, "Email verification failed")
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
    handleError(res, error, 400, "Login failed")
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("authToken")

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  try {
    const user = await AuthService.forgotPassword(email)

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      user
    })
  } catch (error: unknown) {
    handleError(res, error)
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await AuthService.resetPassword(token, password)

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      user
    })
  } catch (error: unknown) {
    handleError(res, error)
  }
}
