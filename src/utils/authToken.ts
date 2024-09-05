import jwt from "jsonwebtoken"
import { Response } from "express"

const TOKEN_SECRET = process.env.TOKEN_SECRET || "your-secret-key"
const TOKEN_EXPIRES_IN = "1h" // You can adjust the token expiration time

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES_IN })
}

export const setTokenCookie = (res: Response, token: string): void => {
  const COOKIE_OPTIONS = {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict" as const, // Helps protect against CSRF attacks
    maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
  }

  res.cookie("authToken", token, COOKIE_OPTIONS)
}
