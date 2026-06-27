import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { validateLogin, validateSignup } from "./auth.validation.js";

const router = Router()

router.post("/signup", validateSignup, signup)
router.post("/login",validateLogin, login)
router.post("/logout", login)

export default router