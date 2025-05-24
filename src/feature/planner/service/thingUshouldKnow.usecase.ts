import { z } from "zod";
import { catchErrorAsync } from "../../../utils/error-handling";
import DestinationRepository from "../../../feature/destination/repository/destination.repository";
import { thingUShouldKnowSchema } from "../api/body/thingUShouldKnowSchema";
import ThingUShouldKnowService from "./thingUshouldKnowAI.service";

class ThingUShouldKnowUseCase {
    private destinationRepo: DestinationRepository;

    constructor() {
        this.destinationRepo = new DestinationRepository();
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
            ThingUShouldKnowService.setPrompt(prompt).getGenerateData()
        );
        if (generatErr) throw generatErr;
        return generatedData;
    }

}

const thingUShouldKnowUseCase = new ThingUShouldKnowUseCase();
export default thingUShouldKnowUseCase;