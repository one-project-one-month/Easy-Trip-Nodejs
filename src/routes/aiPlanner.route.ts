import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
// import { tripAiPlannerController } from "../feature/planner/api/controller";
import { tripPlanAiSchema } from "../feature/planner/api/body/tripPlanAiSchema";

const router = Router();

router
    .get(
        "/planner/Ai-Trip-Plan",
        validationMiddleware.validateRequestBody(tripPlanAiSchema),
        // tripAiPlannerController
    )

export default router;