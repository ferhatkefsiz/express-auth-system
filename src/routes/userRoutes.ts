import { Router } from "express"
import { getAllUsers, getUser, updateUser, deleteUser } from "../controllers/userController"
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router()

router.get("/", authMiddleware, getAllUsers)
router.get("/:id", authMiddleware, getUser)
router.put("/:id", authMiddleware, updateUser)
router.delete("/:id", authMiddleware, deleteUser)

export default router
