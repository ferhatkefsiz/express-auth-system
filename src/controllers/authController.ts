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
