import { z } from "zod";

export const savePlanSchema = z.object({
  plan_id: z.string(),
});
