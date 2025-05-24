import { RequestHandler, Router } from "express";
import { NextFunction, Response, Request } from "express";
import { z } from 'zod'

// routers import
import { default as authRouter } from './auth.route'
import validationMiddleware from "../middleware/validation.middleware";
import { AppError, errorKinds } from "../utils/error-handling";
import { deleteFavPlan, favPlanController, getFavPlan, userRegister } from "../feature/auth/api/controller/favPlanController";

const router = Router()
router.get(
    "/healthCheck",
    (req: Request, res: Response, next: NextFunction) => {
        res.sendStatus(200).end();
    }
);

router.post('/register',userRegister)
router.get('/getFavPlan',getFavPlan)
router.delete('/deleteFavPlan/:id',deleteFavPlan)
router.post('/favPlan',favPlanController)

// register routes
router.use('/auth', authRouter)


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