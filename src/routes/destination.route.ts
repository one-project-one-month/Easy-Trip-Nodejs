import { Router } from "express";
import validationMiddleware from "../middleware/validation.middleware";
import destinationController from "../feature/destination/api/controller/destination.controller";
import getDestinationSchema from "../feature/destination/api/body/getDestination.schema";
import getDescriptionSchema from "../feature/destination/api/body/getDescription.schema";

const router = Router();

router
	.get(
		"/",
		validationMiddleware.validateRequestQuery(getDestinationSchema),
		destinationController.getAll
	)
	.get(
		"/description",
		validationMiddleware.validateRequestQuery(getDescriptionSchema),
		destinationController.getDescription
	)
	.get("/popular", destinationController.getPopularDestination);

export default router;
