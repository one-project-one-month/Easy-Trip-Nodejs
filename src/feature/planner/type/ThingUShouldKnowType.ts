import { z } from "zod";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";

export type ThingUShouldKnowType = z.infer<typeof thingUShouldKnowSchema>;