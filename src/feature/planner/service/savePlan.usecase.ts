import { z } from "zod";
import { catchErrorAsync } from "../../../utils/error-handling";
import DestinationRepository from "../../../feature/destination/repository/destination.repository";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";
import ThingUShouldKnowService from "./thingUshouldKnowAI.service";
import { SavePlanType } from "../type";
import { redisClient } from "../../../config/redisClient";
import { AuthUser } from "../../../feature/auth";
import PlanModel from '../../planner/models/plan.model';
import planModel from "../../planner/models/plan.model";

class SavePlanUseCase {
    private destinationRepo: DestinationRepository;

    constructor() {
        this.destinationRepo = new DestinationRepository();
    }

    async generate(params: SavePlanType & {user: AuthUser}) {
        const { plan_id } = params;

    
        const planFromRedis = await redisClient.get("plan:generated:user:" + params.user?.id + "plan:" + plan_id);
        const creatData = {
            ...(JSON.parse(planFromRedis as string) as any),
            user_id: params.user?.id
        }
        const savedData = await planModel.create(creatData);
        console.log(savedData);
        return savedData;
        // console.log(planFromRedis);


        // if (destinationErr) throw destinationErr;
    }

}

const savePlanUseCase = new SavePlanUseCase();
export default savePlanUseCase;