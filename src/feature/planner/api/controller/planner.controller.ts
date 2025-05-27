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
import getSavePlanUseCase from "../../../../feature/planner/service/getSavedPlan.usecase";
import { savePlanSchema } from "../body/savePlan.schema";
import getSavedPlanList from "../../../../feature/planner/service/getSavedPlanList.usecase";

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
            if (!req.user) throw new AppError(
                errorKinds.notAuthorized, "User not authenticated"
            );
            const data = await savePlanUseCase.execute({
                ...body,
                user: req.user as AuthUser
            });
            res.status(StatusCode.OK).json({ content: data });
        } catch (error) {
            next(
                error instanceof AppError
                    ? error
                    : AppError.new(
                        errorKinds.internalServerError, "internal Server Error"
                    )
            );
        }
    }

    async getSavePlanDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.query as z.infer<typeof savePlanSchema>;
            if (!req.user) throw new AppError(
                errorKinds.notAuthorized, "User not authenticated"
            );
            const data = await getSavePlanUseCase.execute({
                plan_id: params.plan_id,
                user: req.user as AuthUser
            })
            res.status(StatusCode.OK).json({ content: data });
        } catch (error) {
            next(
                error instanceof AppError
                    ? error
                    : AppError.new(
                        errorKinds.internalServerError, "internal Server Error"
                    )
            );
        }
    }

    async getSavedPlanList(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new AppError(
                errorKinds.notAuthorized, "User not authenticated"
            );
            const data = await getSavedPlanList.execute({
                user: req.user as AuthUser
            })
            res.status(StatusCode.OK).json({ content: data });
        } catch (error) {
            next(
                error instanceof AppError
                    ? error
                    : AppError.new(
                        errorKinds.internalServerError, "internal Server Error"
                    )
            );
        }
    }
}

export default new PlannnerController();
