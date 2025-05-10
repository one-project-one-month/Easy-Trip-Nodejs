import { Router } from "express";
import { StatusCode } from "../utils/Status";
import validationMiddleware from "../middleware/validation.middleware";
import { RegisterCredentialSchema, loginCredentialSchema } from "../feature/auth/api/body";

const router = Router();

router.get("/get-user", (req, res) => { res.sendStatus(StatusCode.OK) })
    .post('/login', validationMiddleware.validateRequestBody(loginCredentialSchema), (req, res) => { })
    .post('/register', validationMiddleware.validateRequestQuery(RegisterCredentialSchema), (req, res) => { })
    .post('/logout', (req, res) => { })
    .post('/refresh', (req, res) => { })

export default router;