import { axiosCient } from "../../../config/api-config";
import { ThingUShouldKnowType } from "../type";
import { AppError, errorKinds } from "../../../utils/error-handling";

class ThingUShouldKnowService<T extends Partial<ThingUShouldKnowType>>{
    private thingUShouldKnow: T;
    private prompt: any;
    private apiBaseConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': 'application/json'
        },
    };

    private constructor(promptObj: T) {
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
        this.thingUShouldKnow = promptObj;
    }


    static setPrompt(promptObj: ThingUShouldKnowType) {
        return new ThingUShouldKnowService(promptObj);
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

export default ThingUShouldKnowService;