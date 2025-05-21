import { RequestHandler, Router } from "express";
import { NextFunction, Response, Request } from "express";
import { z } from 'zod'
import validationMiddleware from "../middleware/validation.middleware";
import { AppError, errorKinds } from "../utils/error-handling";
import { run } from "@/feature/destination/seeder";

// routers import
import { default as authRouter } from './auth.route'
import { default as destinationRouter } from './destination.route'


const router = Router()
router.get(
    "/healthCheck",
    async (req: Request, res: Response, next: NextFunction) => {
        await run();
        res.sendStatus(200).end();
    }
);

// register routes
router.use('/auth', authRouter)
router.use('/destinations', destinationRouter)


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