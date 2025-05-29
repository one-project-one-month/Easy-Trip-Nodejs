import PlanRepository from "../repository/plan.repository";
import { AuthUser } from "../../../feature/auth";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import { GetSavedPlanType } from "../type";

class GetSavedPlanList {
    private planRepo: PlanRepository;

    constructor() {
        this.planRepo = new PlanRepository();
    }

    async execute(params: { user: AuthUser } & GetSavedPlanType) {
        const { user, page, limit } = params;
        const [retrievingErr, planList] = await catchErrorAsync(
            this.planRepo.getPlanList({ user_id: user.id, page, limit })
        );
        if (retrievingErr) throw retrievingErr;
        if (!planList) throw AppError.new(
            errorKinds.invalidToken, "invalid Plan Id"
        );
        const [paginatedData, paginatableData] = planList;
        return {
            paginated_data: paginatedData,
            paginatable_data: paginatableData
        };
    }
}

const getSavedPlanList = new GetSavedPlanList();
export default getSavedPlanList;