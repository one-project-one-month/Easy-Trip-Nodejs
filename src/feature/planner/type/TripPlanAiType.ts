import { z } from "zod";
import { tripPlanAiSchema } from "../api/body/tripPlanAiSchema";

export type TripPlanAiType = z.infer<typeof tripPlanAiSchema>;