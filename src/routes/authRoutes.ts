import { Router } from "express"
import { register, verifyEmail, login, logout, forgotPassword, resetPassword } from "../controllers/authController"

const router = Router()

router.post("/register", register)
router.post("/verify-email", verifyEmail)

router.post("/login", login)
router.post("/logout", logout)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router
