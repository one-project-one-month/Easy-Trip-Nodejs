import { z } from "zod";


const getDestinationSchema = z.object({
    search: z.string().optional(),
});

export default getDestinationSchema;