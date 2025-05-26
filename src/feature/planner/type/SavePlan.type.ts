import { z } from "zod";
import { savePlanSchema } from "../api/body/savePlan.schema";

export type SavePlanType = z.infer<typeof savePlanSchema>;