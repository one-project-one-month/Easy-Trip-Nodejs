import { Router } from "express";
import { NextFunction, Response, Request } from "express";

// routers import
import { default as authRouter } from './auth.route'
import { default as plannerRouter } from './planner.route'
import { AppError, errorKinds } from "../utils/error-handling";
import TripPlanAiGenerateService from "@/feature/planner/service/tripPlanAiGenerate";

const router = Router()
router.get(
    "/healthCheck",
    (req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(200).end();
    }
);

// register routes
router.use('/auth', authRouter)
router.use('/trip', plannerRouter)

router.get('/trip', (req: Request, res: Response, next: NextFunction) => {
        const blahc = TripPlanAiGenerateService();
        return res.status(200).json(blahc).end();
})
//404 handler
router.use((req: Request, res: Response, next: NextFunction) => {
    // send 404 error
    return next(AppError.new(errorKinds.notFound, "Not Found"));

});

// error handling
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.getStatus()).json({
            message: err.message,
            payload: err.payload
        }).end();
    }
});

export default router;