import { Router } from "express";
import { NextFunction, Response, Request } from "express";

// routers import
import { default as authRouter } from './auth.route'
import { default as plannerRouter } from './planner.route'
import { AppError, errorKinds } from "../utils/error-handling";

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