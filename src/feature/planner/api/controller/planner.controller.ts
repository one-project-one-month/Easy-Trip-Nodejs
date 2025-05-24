import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { thingUShouldKnowSchema } from "../body/thingUShouldKnowSchema";
import { GeneratePlanService, ThingUShouldKnowService, getPlaceData } from "../../service";
import { StatusCode } from "../../../../utils/Status";
import { AppError, errorKinds } from "../../../../utils/error-handling";

export const thingUShouldKnowController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as z.infer<typeof thingUShouldKnowSchema>;
        const generatedAIData = await ThingUShouldKnowService.setPrompt(body).getGenerateData();
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

export const generatePlanController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body as z.infer<typeof thingUShouldKnowSchema>;
        const generatedAIData = await GeneratePlanService.setPrompt(body).getGenerateData();

        //Pyin Oo Lwin
        const placeSearch = { searchDestination: body.destination.toLowerCase().split(" ").join("-") + "-" + "myanmar" };
        const placeData = await getPlaceData(placeSearch);
        const response = {
            place_description: placeData,
            generatedData: generatedAIData
        }
        res.status(StatusCode.OK).json(response);
    } catch (error) {
        console.log(error)
        next(
            error instanceof AppError
                ? error
                : AppError.new(errorKinds.internalServerError, "internal Server Error")
        );
    }
}
