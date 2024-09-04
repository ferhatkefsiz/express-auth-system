import mongoose, { Document, Schema } from "mongoose"
import bcryptjs from "bcryptjs"

export interface User extends Document {
  email: string
  password: string
  name: string
  role: "user" | "admin"
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.password)
}

const UserModel = mongoose.model<User>("User", userSchema)

export default UserModel
