
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import planModel from "../models/plan.model";

class PlanRepository {
    async getById({ id, user_id }: { id: string, user_id: string }) {
        try {
            const data = await planModel.findOne({
                plan_id: id, user_id
            });
            return data;
        } catch (err) {
            throw AppError.new(
                errorKinds.internalServerError,
                "internal Server Error while geting plan"
            );
        }
    }

    async getPlanList(params: { user_id: string, page?: number, limit?: number }) {
        try {
            const { user_id, page, limit } = params;
            const pageNo = page || 1;
            const pageSize = limit || 5;
            const skip = (pageNo - 1) * pageSize;

            const [retrieveError, retrieveData] = await catchErrorAsync(
                Promise.all([
                    planModel
                        .find({ user_id })
                        .skip(skip)
                        .limit(pageSize),
                    planModel
                        .countDocuments({ user_id })
                ])
            );
            if (retrieveError) throw retrieveError;
            const [savedPlanList, totalCount] = retrieveData;
            const metaData = {
                total: totalCount,
                page: pageNo,
                limit: pageSize,
                totalPages: Math.ceil(totalCount / pageSize),
            };

            return [savedPlanList, metaData];
        } catch (error) {
            throw AppError.new(
                errorKinds.internalServerError,
                "internal Server Error while geting plan list"
            );
        }
    }

    async find() {
        try {
            const data = await planModel.find().limit(10);
            return data;
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "internal Server Error");
        }
    }

    async create(planData: any) {
        try {
            const savedData = await planModel.create(planData)
            return savedData;
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "internal server error while saving plan data")
        }
    }
}

export default PlanRepository;