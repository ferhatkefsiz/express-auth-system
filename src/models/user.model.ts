import mongoose, { Document, Schema } from "mongoose"
import bcryptjs from "bcryptjs"

export interface User extends Document {
  email: string
  password: string
  name: string
  lastLogin: Date
  verificationToken: string
  verificationTokenExpiresAt: Date
  isVerified: boolean
  role: "user" | "admin"
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date, default: null },
    name: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verificationToken: String,
    verificationTokenExpiresAt: Date
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.password)
}

const UserModel = mongoose.model<User>("User", userSchema)

export default UserModel
