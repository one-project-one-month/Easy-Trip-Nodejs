import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { tripPlanAiSchema } from "../body/tripPlanAiSchema";
import { tripPlanAiGenerate } from "../../service";
import { StatusCode } from "@/utils/Status";
import { AppError, errorKinds } from "@/utils/error-handling";

export const aiTripPlannerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as z.infer<typeof tripPlanAiSchema>;
        const generatedAIData = await tripPlanAiGenerate.setPrompt(body).getGenerateData();
        const response = {
            data: generatedAIData?.tripPlan
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
