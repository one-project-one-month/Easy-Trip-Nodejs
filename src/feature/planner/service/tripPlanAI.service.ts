import { axiosCient } from "../../../config/api-config";
import { TripPlanAiType, TripPlanReturnType } from "../type";
import { AppError, catchError, errorKinds } from "../../../utils/error-handling";
import { parsePossiblyMalformedJsonString } from "../../../utils/ai-json-parse";
import { PlanDto } from "../api/dto";

class TripPlanAiGenerateService<P extends Partial<TripPlanAiType>>{
    private tripAiPlan: P;
    private prompt: any;
    private apiBaseConfig = {
        method: 'post',
        baseURL: "https://easy-trip-python-5.onrender.com/trip/invoke",
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': 'application/json'
        },
    };

    private constructor(promptObj: P) {
        const {
            destination,
            startDate,
            endDate,
            budget,
        } = promptObj;

        let prompt = JSON.stringify({
            "input": {
                "input": `
                Explain with description why we should bring in order to go to ${destination} with Family within ${startDate} to ${endDate} with ${budget} MMK
                `
            }
        });
        this.prompt = prompt;
        this.tripAiPlan = promptObj;
    }


    static setPrompt(promptObj: TripPlanAiType) {
        return new TripPlanAiGenerateService(promptObj);
    }

    async getGenerateData(): Promise<TripPlanReturnType> {
        try {
            // generate content from ai
            const response = await axiosCient.request({
                ...this.apiBaseConfig,
                data: this.prompt
            });
            const rawString = response.data?.output?.content;
            if (!rawString || typeof rawString !== 'string') {
                throw new Error('Invalid or missing content from AI response');
            }

            // data transformation
            const [parseErr, parseData] = catchError(() => parsePossiblyMalformedJsonString(rawString));
            if (parseErr) throw parseErr
            if (!parseData || typeof parseData !== 'object') {
                throw new AppError(errorKinds.internalServerError, "something went wrong while feting Ai Generate Data");
            }
            const [dtoErr, returnPlanData] = catchError(() => new PlanDto(parseData));
            if (dtoErr) throw dtoErr

            return returnPlanData;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw AppError.new(
                    errorKinds.internalServerError, "something went wrong while feting Ai Generate Data"
                );
            }
        }
    }
}

export default TripPlanAiGenerateService;