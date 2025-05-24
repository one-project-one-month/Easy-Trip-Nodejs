import { z } from "zod";
import { catchErrorAsync } from "../../../utils/error-handling";
import DestinationRepository from "../../../feature/destination/repository/destination.repository";
import TripPlanAiGenerateService from "./tripPlanAI.service";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";

class TripPlanUseCase {
    private destinationRepo: DestinationRepository;
    // private tripPlanAiGenerateService: TripPlanAiGenerateService;

    constructor() {
        this.destinationRepo = new DestinationRepository();
        // this.tripPlanAiGenerateService = new TripPlanAiGenerateService();
    }

    async generate(params: z.infer<typeof thingUShouldKnowSchema>) {
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
        return generatedData;
    }

}

const tripPlanUseCase = new TripPlanUseCase();
export default tripPlanUseCase;