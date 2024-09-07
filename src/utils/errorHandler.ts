import { Response } from "express"

export const handleError = (res: Response, error: unknown, statusCode = 400, customMessage: string = ""): void => {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

  const fullMessage = customMessage ? `${customMessage}: ${errorMessage}` : errorMessage

  res.status(statusCode).json({
    error: fullMessage
  })
}
