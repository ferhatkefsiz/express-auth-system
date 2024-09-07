import { Request, Response } from "express"
import UserModel from "../models/user.model"
import bcryptjs from "bcryptjs"

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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id
    const { email, name, password } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
      res.status(404).json({
        message: "User not found"
      })
      return
    }

    if (email) {
      user.email = email
    }
    if (name) {
      user.name = name
    }
    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10)
      user.password = hashedPassword
    }

    await user.save()

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    res.status(500).json({
      message: "Error updating user",
      error: errorMessage
    })
  }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id

    const user = await UserModel.findByIdAndDelete(userId)

    if (!user) {
      res.status(404).json({
        message: "User not found"
      })
      return
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    res.status(500).json({
      message: "Error deleting user",
      error: errorMessage
    })
  }
}
