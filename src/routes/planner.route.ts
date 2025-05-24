import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { thingUShouldKnowSchema } from "../feature/planner/api/body/thingUShouldKnowSchema";
import { PlannnerController } from "../feature/planner/api/controller";

const router = Router();

router
    .get(
        "/planner/thring-you-should-know",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.generateThingUShouldKnow
    )
    .get(
        "/planner/generate-trip-plans",
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.generatePlan
    )

export default router;