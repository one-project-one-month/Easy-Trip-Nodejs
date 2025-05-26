import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { thingUShouldKnowSchema } from "../body/thingUShouldKnowSchema";
import { StatusCode } from "../../../../utils/Status";
import { AppError, errorKinds } from "../../../../utils/error-handling";
import tripPlanUseCase from '../../service/tripPlan.usecase';
import thingUShouldKnowUseCase from "../../service/thingUshouldKnow.usecase";
import { AuthUser } from "../../../../feature/auth";
import { SavePlanType } from "../../../../feature/planner/type";
import savePlanUseCase from "../../../../feature/planner/service/savePlan.usecase";

class PlannnerController {
    async thingUShouldKnow(req: Request, res: Response, next: NextFunction) {
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

    async tripPlan(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as z.infer<typeof thingUShouldKnowSchema>;
            if (!req.user) throw new AppError(errorKinds.notAuthorized, "User not authenticated");
            const data = await tripPlanUseCase.generate({
                ...body,
                user: req.user as AuthUser
            });
            const response = {
                content: data
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

    async savePlan(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as SavePlanType;
            if (!req.user) throw new AppError(errorKinds.notAuthorized, "User not authenticated");
            const data = await savePlanUseCase.generate({
                ...body,
                user: req.user as AuthUser
            });
            // const data = await tripPlanUseCase.savePlan({
            //     ...body,
            //     user: req.user as AuthUser
            // });
            // const response = {
            //     content: data
            // }
            res.status(StatusCode.OK).json({ response: "success" });
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
