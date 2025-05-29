import PlanRepository from "../repository/plan.repository";
import { SavePlanType } from "../type";
import { redisClient } from "../../../config/redisClient";
import { AuthUser } from "../../../feature/auth";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";

class SavePlanUseCase {
    private planRepo: PlanRepository;

    constructor() {
        this.planRepo = new PlanRepository();
    }

    async execute(params: SavePlanType & { user: AuthUser }) {
        const { plan_id, user } = params;
        const planFromRedis = await redisClient.get(
            "plan:generated:user:" + params.user?.id + "plan:" + plan_id
        );
        const creatData = {
            ...(JSON.parse(planFromRedis as string) as any),
            user_id: params.user?.id
        }
        const [retrievingErr, existdata] = await catchErrorAsync(
            this.planRepo.getById({ id: plan_id, user_id: user.id })
        );
        if (retrievingErr) throw retrievingErr;
        if (existdata) throw AppError.new(
            errorKinds.alreadyExist, "plan already saved"
        );

        const [savingErr, savedData] = await catchErrorAsync(
            this.planRepo.create(creatData)
        );
        if (savingErr) throw savingErr;
        return savedData;
    }
}

const savePlanUseCase = new SavePlanUseCase();
export default savePlanUseCase;