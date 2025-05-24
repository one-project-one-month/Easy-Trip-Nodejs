import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { generatePlanController, thingUShouldKnowController } from "../feature/planner/api/controller";
import { thingUShouldKnowSchema } from "../feature/planner/api/body/thingUShouldKnowSchema";

const router = Router();

router
    .get(
        "/planner/thring-you-should-know",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        thingUShouldKnowController
    )
    .get(
        "/planner/generate-trip-plans",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        generatePlanController
    )

export default router;