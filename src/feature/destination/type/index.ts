import { z } from 'zod';
import getDescriptionSchema from '../api/body/getDescription.schema';
import getDestinationSchema from '../api/body/getDestination.schema';

export type GetDestinationRequest = z.infer<typeof getDestinationSchema>;
export type GetDescriptionRequest = z.infer<typeof getDescriptionSchema>;