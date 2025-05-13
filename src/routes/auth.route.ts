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

const router = Router();

router
  .get("/get-user", authenticateJWT, (req, res) => {
    getUserController(req, res);
  })
  .post(
    "/login",
    validationMiddleware.validateRequestBody(loginCredentialSchema),
    loginController
  )
  .post(
    "/register",
    validationMiddleware.validateRequestBody(RegisterCredentialSchema),
    (req, res) => {
      registerController(req, res);
    }
  )
  .post("/logout", (req, res) => {
    logoutController(req, res);
  })
  .post("/refresh", (req, res) => {
    refreshToken(req, res);
  });

export default router;
