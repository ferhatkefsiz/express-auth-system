import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

export default app
