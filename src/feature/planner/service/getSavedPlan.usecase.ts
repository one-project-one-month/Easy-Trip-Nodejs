import PlanRepository from "../repository/plan.repository";
import { SavePlanType } from "../type";
import { AuthUser } from "../../../feature/auth";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";

class GetSavePlanUseCase {
    private planRepo: PlanRepository;

    constructor() {
        this.planRepo = new PlanRepository();
    }

    async execute(params: SavePlanType & { user: AuthUser }) {
        const { plan_id, user } = params;

        const [retrievingErr, savedData] = await catchErrorAsync(
            this.planRepo.getById({ id: plan_id, user_id: user.id })
        );
        if (retrievingErr) throw retrievingErr;
        if (!savedData) throw AppError.new(errorKinds.invalidToken, "invalid Plan Id");
        return savedData;
    }
}

const getSavePlanUseCase = new GetSavePlanUseCase();
export default getSavePlanUseCase;