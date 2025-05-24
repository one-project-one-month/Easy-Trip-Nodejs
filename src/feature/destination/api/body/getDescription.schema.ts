import { z } from "zod";

const getDescriptionSchema = z.object({
    destination_id: z.string(),
});

export default getDescriptionSchema;