import { axiosCient } from "@/config/api-config";
import { TripPlanAiType } from "../type";
import { AppError, errorKinds } from "@/utils/error-handling";

class TripPlanAiGenerateService<P extends Partial<TripPlanAiType>>{
    private tripAiPlan: P;
    private prompt: any;
    private apiBaseConfig = {
        method: 'post',
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

    async getGenerateData() {
        try {
            const response = await axiosCient.request({
                ...this.apiBaseConfig,
                data: this.prompt
            });

            const rawString = response.data?.output?.content;
            if (!rawString || typeof rawString !== 'string') {
                throw new Error('Invalid or missing content from AI response');
            }

            const cleaned = rawString
                .replace(/```json\n?/, '')
                .replace(/```$/, '')
                .trim();

            return JSON.parse(cleaned);
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "something went wrong while feting Ai Generate Data");
        }
    }
}

export default TripPlanAiGenerateService;