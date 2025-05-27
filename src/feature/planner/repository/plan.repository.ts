
import { AppError, errorKinds } from "../../../utils/error-handling";
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

    async getPlanList({ user_id }: { user_id: string }) {
        try {
            const planList = await planModel.find({
                user_id
            })
            return planList;
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