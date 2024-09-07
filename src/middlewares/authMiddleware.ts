import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { handleError } from "../utils/errorHandler"

interface DecodedToken {
  id: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || "your-secret-key") as JwtPayload | DecodedToken

    if (typeof decoded === "object" && "id" in decoded) {
      req.body.userId = decoded.id

      next()
    } else {
      throw new Error("Invalid token structure")
    }
  } catch (error) {
    handleError(res, error, 401, "Unauthorized: Invalid token")
  }
}
