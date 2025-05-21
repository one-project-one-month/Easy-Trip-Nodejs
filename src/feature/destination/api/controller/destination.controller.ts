import { NextFunction, Request, Response } from "express";
import { AppError, errorKinds } from "@/utils/error-handling";
import destinationUseCase from "../../service/destination.usecase";
import { GetDescriptionRequest, GetDestinationRequest } from "../../type";

class DestinationController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { search } = req.query as GetDestinationRequest;
            const data = await destinationUseCase.GetDataByFilter(search || "");
            res.status(200).json(data);
        } catch (err) {
            next(
                err instanceof AppError
                    ? err
                    : AppError.new(errorKinds.internalServerError, "Internal Server Error")
            );
        }

    }

    async getDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const { destination_id } = req.query as GetDescriptionRequest;
            const data = await destinationUseCase.handleIncrementScore(destination_id)
            res.status(200).json(data);
        } catch (err) {
            next(
                err instanceof AppError
                    ? err
                    : AppError.new(errorKinds.internalServerError, "Internal Server Error")
            )
        }
    }
}

const destinationController = new DestinationController();
export default destinationController;