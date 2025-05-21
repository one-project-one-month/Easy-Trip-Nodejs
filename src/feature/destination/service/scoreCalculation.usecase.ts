import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import DestinationRepository from "../repository/destination.repository";

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

    private calculationRule = scoreMap;

    constructor() {
        this.repository = new DestinationRepository();
    }

    async incrementScore(params: { destinationId: string, step: Step }) {
        const { destinationId, step } = params;
        const increasePoint = this.calculationRule[step];
        const [err, data] = await catchErrorAsync(this.repository.findAndIncrementScore({
            destinationId,
            score: increasePoint
        }));

        if (err) throw AppError.new(errorKinds.internalServerError, "Error on incrementing score")
        return data
    }
}

const scoreCalculationUseCase = new ScoreCalculationUseCase();
export default scoreCalculationUseCase;