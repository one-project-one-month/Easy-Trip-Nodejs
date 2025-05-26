import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { thingUShouldKnowSchema } from "../feature/planner/api/body/thingUShouldKnowSchema";
import { PlannnerController } from "../feature/planner/api/controller";

const router = Router();

router
    .post(
        "/planner/thring-you-should-know",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.thingUShouldKnow
    )
    .post(
        "/planner/generate-trip-plans",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.tripPlan
    )

export default router;