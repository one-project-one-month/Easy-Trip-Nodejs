import { z } from "zod";
import { catchErrorAsync } from "../../../utils/error-handling";
import DestinationRepository from "../../../feature/destination/repository/destination.repository";
import TripPlanAiGenerateService from "./tripPlanAI.service";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";
import PlaceDataRetrievalService from "../../../feature/place/service/placeDataRetrieval.service";
import NominatimPlaceService from "../../../feature/place/service/nominatimPlace.service";
import { GeneratedTripPlan } from "../type";

class TripPlanUseCase {
    private destinationRepo: DestinationRepository;
    private placeDataRetrievalService: PlaceDataRetrievalService;
    // private tripPlanAiGenerateService: TripPlanAiGenerateService;

    constructor() {
        this.destinationRepo = new DestinationRepository();
        this.placeDataRetrievalService = new PlaceDataRetrievalService(new NominatimPlaceService());
        // this.tripPlanAiGenerateService = new TripPlanAiGenerateService();
    }

    async generate(params: z.infer<typeof thingUShouldKnowSchema>): Promise<GeneratedTripPlan> {
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

        return { place_detail: placeData, generate_data: generatedData };
    }

}

const tripPlanUseCase = new TripPlanUseCase();
export default tripPlanUseCase;