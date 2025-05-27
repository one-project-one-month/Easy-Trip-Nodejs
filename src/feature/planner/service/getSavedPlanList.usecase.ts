import PlanRepository from "../repository/plan.repository";
import { AuthUser } from "../../../feature/auth";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";

class GetSavedPlanList {
    private planRepo: PlanRepository;

    constructor() {
        this.planRepo = new PlanRepository();
    }

    async execute(params: { user: AuthUser }) {
        const { user } = params;

        const [retrievingErr, savedPlanList] = await catchErrorAsync(
            this.planRepo.getPlanList({ user_id: user.id })
        );
        if (retrievingErr) throw retrievingErr;
        if (!savedPlanList) throw AppError.new(
            errorKinds.invalidToken, "invalid Plan Id"
        );
        return savedPlanList;
    }
}

const getSavedPlanList = new GetSavedPlanList();
export default getSavedPlanList;