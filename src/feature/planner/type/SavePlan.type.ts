import { z } from "zod";
import { savePlanSchema, getSavedPlanSchema } from "../api/body/savePlan.schema";

export type SavePlanType = z.infer<typeof savePlanSchema>;
export type GetSavedPlanType = z.infer<typeof getSavedPlanSchema>;