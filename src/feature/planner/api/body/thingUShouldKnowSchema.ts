import { z } from "zod";

export const thingUShouldKnowSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.string(),
  attendentsType: z.string(),
});
