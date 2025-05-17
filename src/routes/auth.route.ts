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
  googleOAuthController,
} from "../feature/auth/api/controller/auth.controller";
import passport from "passport";

const router = Router();

router
  .get("/get-user", authenticateJWT, getUserController)
  .post(
    "/login",
    validationMiddleware.validateRequestBody(loginCredentialSchema),
    passport.authenticate("local", { session: false }),
    loginController
  )
  .post(
    "/register",
    validationMiddleware.validateRequestBody(RegisterCredentialSchema),
    registerController
  )
  .post("/logout", logoutController)
  .post("/refresh", refreshToken)
  // .get(
  //   "/google",
  //   passport.authenticate("google", { scope: ["profile", "email"] })
  // )
  // .get(
  //   "/google/callback",
  //   passport.authenticate("google", {
  //     failureRedirect: "/login",
  //     session: false,
  //   }),
  //   googleOAuthController
  // );

export default router;
