import { Request, Response } from "express"
import UserModel from "../models/user.model"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()

    res.status(200).json({
      success: true,
      users
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    res.status(500).json({
      message: "Failed to retrieve users",
      error: errorMessage
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      user
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    res.status(500).json({
      message: "Failed to retrieve user",
      error: errorMessage
    })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {}
export const deleteUser = async (req: Request, res: Response): Promise<void> => {}
