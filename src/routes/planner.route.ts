import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import { thingUShouldKnowSchema } from "../feature/planner/api/body/thingUShouldKnowSchema";
import { savePlanSchema } from '../feature/planner/api/body/savePlan.schema';
import { PlannnerController } from "../feature/planner/api/controller";
import plannerController from "../feature/planner/api/controller/planner.controller";

const router = Router();

router
    .get(
        '/planner/get-saved-plan',
        validationMiddleware.validateRequestQuery(savePlanSchema),
        plannerController.getSavePlanDetail
    )
    .get(
        '/planner/get-saved-plan-list',
        plannerController.getSavedPlanList
    )
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
    .post(
        "/planner/save-plan",
        validationMiddleware.validateRequestBody(savePlanSchema),
        PlannnerController.savePlan
    );

export default router;