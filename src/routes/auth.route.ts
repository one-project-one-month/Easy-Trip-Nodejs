import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import {
  RegisterCredentialSchema,
  loginCredentialSchema,
} from "../feature/auth/api/body";
import { authenticateJWT } from "../middleware/authenticate";
import {
  getUserController,
  registerController,
  loginController,
  refreshToken,
  logoutController,
} from "../feature/auth/api/controller/auth.controller";
import passport from "passport";

const router = Router();

router
  .get("/get-user", authenticateJWT, getUserController)
  .post(
    "/login",
    validationMiddleware.validateRequestBody(loginCredentialSchema),
    passport.authenticate('local', { session: false }),
    loginController
  )
  .post(
    "/register",
    validationMiddleware.validateRequestBody(RegisterCredentialSchema),
    registerController
  )
  .post("/logout",  logoutController)
  .post("/refresh", refreshToken);

export default router;
