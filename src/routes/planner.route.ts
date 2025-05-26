import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { thingUShouldKnowSchema } from "../feature/planner/api/body/thingUShouldKnowSchema";
import { savePlanSchema } from '../feature/planner/api/body/savePlan.schema';
import { PlannnerController } from "../feature/planner/api/controller";
import passport from "passport";

const router = Router();

router
    .post(
        "/planner/thring-you-should-know",
        passport.authenticate("access-jwt", { session: false }),
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.thingUShouldKnow
    )
    .post(
        "/planner/generate-trip-plans",
        passport.authenticate("access-jwt", { session: false }),
        validationMiddleware.validateRequestBody(thingUShouldKnowSchema),
        PlannnerController.tripPlan
    )
    .post(
        "/planner/save-plan",
        passport.authenticate("access-jwt", { session: false }),
        validationMiddleware.validateRequestBody(savePlanSchema),
        PlannnerController.savePlan
    )

export default router;