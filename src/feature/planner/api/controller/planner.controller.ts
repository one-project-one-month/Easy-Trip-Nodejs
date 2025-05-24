import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { thingUShouldKnowSchema } from "../body/thingUShouldKnowSchema";
import { StatusCode } from "../../../../utils/Status";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import tripPlanUseCase from '../../service/tripPlan.usecase';
import thingUShouldKnowUseCase from "../../service/thingUshouldKnow.usecase";


class PlannnerController {
    async generateThingUShouldKnow(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as z.infer<typeof thingUShouldKnowSchema>;
            const generatedAIData = await thingUShouldKnowUseCase.generate(body);
            const response = {
                data: generatedAIData?.thingsYouShouldBring
            }
            res.status(StatusCode.OK).json(response);
        } catch (error) {
            next(
                error instanceof AppError
                    ? error
                    : AppError.new(errorKinds.internalServerError, "internal Server Error")
            );
        }
    }

    async generatePlan (req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as z.infer<typeof thingUShouldKnowSchema>;
            const data = await tripPlanUseCase.generate(body);
            const response = {
                generatedData: data
            }
            res.status(StatusCode.OK).json(response);
        } catch (error) {
            next(
                error instanceof AppError
                    ? error
                    : AppError.new(errorKinds.internalServerError, "internal Server Error")
            );
        }
    }
}

export default new PlannnerController();
