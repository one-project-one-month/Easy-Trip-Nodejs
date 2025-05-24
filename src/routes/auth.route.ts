import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import {
  RegisterCredentialSchema,
  loginCredentialSchema,
  refreshTokenCredentialSchema,
} from "../feature/auth/api/body";
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
  .get(
    "/get-user",
    passport.authenticate("access-jwt", { session: false }),
    getUserController
  )
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
  .post(
    "/logout",
    passport.authenticate("access-jwt", { session: false }),
    logoutController
  )
  .post(
    "/refresh",
    validationMiddleware.validateRequestBody(refreshTokenCredentialSchema),
    refreshToken
  )
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
