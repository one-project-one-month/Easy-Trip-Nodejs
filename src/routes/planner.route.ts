import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { thingUShouldKnowController } from "@/feature/planner/api/controller";
import { thingUShouldKnowSchema } from "@/feature/planner/api/body/thingUShouldKnowSchema";

const router = Router();

router
    .get(
        "/planner/thring-you-should-know",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        thingUShouldKnowController
    )

export default router;