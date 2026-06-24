import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { validateLogin, validateSignup } from "./auth.validation.js";
const router = Router();
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
export default router;
//# sourceMappingURL=auth.route.js.map