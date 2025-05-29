import PlaceDataRetrievalService from "../../../feature/place/service/placeDataRetrieval.service";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import { DestinationDto } from "../api/dto/destination.dto";
import DestinationRepository from "../repository/destination.repository";
import NominatimPlaceService from "../../../feature/place/service/nominatimPlace.service";

const scoreMap = {
    "step_1": 10,
    "step_2": 20,
    "step_3": 30,
    "step_4": 40,
} as const

type ScoreMap = typeof scoreMap;
type Step = keyof ScoreMap;

class ScoreCalculationUseCase {
    private repository: DestinationRepository;
    private placeRetriever: PlaceDataRetrievalService;

    private calculationRule = scoreMap;

    constructor() {
        this.repository = new DestinationRepository();
        this.placeRetriever = new PlaceDataRetrievalService(new NominatimPlaceService);
    }

    async incrementScore(params: { destinationId: string, step: Step }): Promise<DestinationDto> {
        const { destinationId, step } = params;
        const increasePoint = this.calculationRule[step];
        const [err, data] = await catchErrorAsync(this.repository.findAndIncrementScore({
            destinationId,
            score: increasePoint
        }));

        if (err || !data) throw AppError.new(errorKinds.internalServerError, "Error on incrementing score");
        // const [placeErr, placeData] = await catchErrorAsync(
        //     this.placeRetriever.execute(data.destination)
        // );
        // if (placeErr || !placeData) {
        //     throw AppError.new(
        //         errorKinds.internalServerError, "Error on retrieving place data"
        //     );
        // }
        return new DestinationDto(data);
    }
}

const scoreCalculationUseCase = new ScoreCalculationUseCase();
export default scoreCalculationUseCase;