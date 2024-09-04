import app from "./app"
import mongoose from "mongoose"
import fs from "fs"

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined")
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const connection = mongoose.connection
    const host = connection.host

    console.log("Connected to MongoDB")

    const logMessage = `Connected to MongoDB at host: ${host}\n`
    fs.appendFileSync("database.log", logMessage, "utf8")

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
  })
