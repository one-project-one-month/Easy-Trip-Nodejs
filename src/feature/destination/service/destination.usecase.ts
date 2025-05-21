import { AppError, catchErrorAsync, errorKinds } from "@/utils/error-handling";
import DestinationRepository from "../repository/destination.repository";
import ScoreCalculationService from "./scoreCalculation.service";

class DestinationUseCase {
    private repository: DestinationRepository;
    private scoreCalculationService: ScoreCalculationService

    constructor() {
        this.repository = new DestinationRepository();
        this.scoreCalculationService = new ScoreCalculationService();
    }

    async GetDataByFilter(search: string) {
        const [err, retrieveData] = await catchErrorAsync(this.repository.find({ search: search }));
        if (err) throw AppError.new(
            errorKinds.internalServerError,
            "Error during retrieving data"
        );

        return retrieveData;
    }

    async handleIncrementScore(id: string) {
        const [err, retrieveData] = await catchErrorAsync(
            this.scoreCalculationService.incrementScore(
                { destinationId: id, step: "step_2" }
            ));
        if (err) throw AppError.new(
            errorKinds.internalServerError,
            "Error during retrieving data"
        );
        return retrieveData;
    }
}

const destinationUseCase = new DestinationUseCase();
export default destinationUseCase;