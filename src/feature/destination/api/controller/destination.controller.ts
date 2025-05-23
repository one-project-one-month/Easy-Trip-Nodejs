import { NextFunction, Request, Response } from "express";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import destinationUseCase from "../../service/destination.usecase";
import scoreCalculationUseCase from "../../service/scoreCalculation.usecase";
import { GetDescriptionRequest, GetDestinationRequest } from "../../type";

class DestinationController {
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const { search } = req.query as GetDestinationRequest;
			const data = await destinationUseCase.getByFilter(search || "");
			res.status(200).json({
				content: data,
			});
		} catch (err) {
			next(
				err instanceof AppError
					? err
					: AppError.new(
							errorKinds.internalServerError,
							"Internal Server Error"
					  )
			);
		}
	}

	async getDescription(req: Request, res: Response, next: NextFunction) {
		try {
			const { destination_id } = req.query as GetDescriptionRequest;
			const data = await scoreCalculationUseCase.incrementScore({
				destinationId: destination_id,
				step: "step_2",
			});
			res.status(200).json({
				content: data,
			});
		} catch (err) {
			next(
				err instanceof AppError
					? err
					: AppError.new(
							errorKinds.internalServerError,
							"Internal Server Error"
					  )
			);
		}
	}

	async getPopularDestination(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const data = await destinationUseCase.getPopularDestination({
				limit: 6,
				orderBy: "desc",
			});
			res.status(200).json({
				content: data,
			});
		} catch (err) {
			next(
				err instanceof AppError
					? err
					: AppError.new(
							errorKinds.internalServerError,
							"Internal Server Error"
					  )
			);
		}
	}

	async getFromNominatim(req: Request, res: Response, next: NextFunction) {
		try {
			const { query } = req.query;
			if (!query || typeof query !== "string") {
				return res
					.status(400)
					.json({ message: "Missing or invalid query parameter" });
			}
			const data = await destinationUseCase.getFromNominatim(query);
			res.status(200).json({
				content: data,
			});
		} catch (err) {
			next(
				err instanceof AppError
					? err
					: AppError.new(
							errorKinds.internalServerError,
							"Internal Server Error"
					  )
			);
		}
	}
}

const destinationController = new DestinationController();
export default destinationController;
