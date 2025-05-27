import { z } from "zod";

export const savePlanSchema = z.object({
  plan_id: z.string(),
});

export const getSavedPlanSchema = z.object({
  page: z.string().transform(str => Number(str)).optional(),
  limit: z.string().transform(str => Number(str)).optional()
})
