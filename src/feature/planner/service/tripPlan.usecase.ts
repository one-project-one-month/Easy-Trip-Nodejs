import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { catchErrorAsync } from "../../../utils/error-handling";
import DestinationRepository from "../../../feature/destination/repository/destination.repository";
import TripPlanAiGenerateService from "./tripPlanAI.service";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";
import PlaceDataRetrievalService from "../../../feature/place/service/placeDataRetrieval.service";
import NominatimPlaceService from "../../../feature/place/service/nominatimPlace.service";
import { GeneratedTripPlan } from "../type";
import { redisClient } from "../../../config/redisClient";
import { AuthUser } from "../../../feature/auth";

class TripPlanUseCase {
    private destinationRepo: DestinationRepository;
    private placeDataRetrievalService: PlaceDataRetrievalService;
    // private tripPlanAiGenerateService: TripPlanAiGenerateService;

    constructor() {
        this.destinationRepo = new DestinationRepository();
        this.placeDataRetrievalService = new PlaceDataRetrievalService(new NominatimPlaceService());
        // this.tripPlanAiGenerateService = new TripPlanAiGenerateService();
    }

    async generate(params: z.infer<typeof thingUShouldKnowSchema> & { user: AuthUser }): Promise<GeneratedTripPlan> {
        const [destinationErr, destination] = await catchErrorAsync(
            this.destinationRepo.getById({ id: params.destination_id })
        );
        if (destinationErr) throw destinationErr;

        const prompt = {
            destination: destination?.destination_name as string,
            startDate: params.startDate,
            endDate: params.endDate,
            budget: params.budget,
            attendentsType: params.attendentsType
        }

        const [generatErr, generatedData] = await catchErrorAsync(
            TripPlanAiGenerateService.setPrompt(prompt).getGenerateData()
        );
        if (generatErr) throw generatErr;

        const [placeErr, placeData] = await catchErrorAsync(
            this.placeDataRetrievalService.execute(destination?.destination_name as string)
        )
        if (placeErr) throw placeErr

        const planId = uuidv4();
        const generatedPlan = { plan_id: planId, place_detail: placeData, generate_data: generatedData };

        await redisClient.set("plan:generated:user:" + params.user?.id + "plan:" + planId, JSON.stringify(generatedPlan), 'EX', 60 * 60 * 24); // 1 day expiration);
        return generatedPlan;
    }

}

const tripPlanUseCase = new TripPlanUseCase();
export default tripPlanUseCase;