import { axiosCient } from "../../../config/api-config";
import { parsePossiblyMalformedJsonString } from "../../../utils/ai-json-parse";
import { AppError, errorKinds } from "../../../utils/error-handling";

type ThingUShouldKnowType = {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
}

class ThingUShouldKnowService<T extends Partial<ThingUShouldKnowType>>{
    private thingUShouldKnow: T;
    private prompt: any;
    private apiBaseConfig = {
        baseURL: 'https://latest-should-bring.onrender.com/things/invoke',
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

            return parsePossiblyMalformedJsonString(rawString);
        } catch (error) {
            console.log(error);
            throw AppError.new(errorKinds.internalServerError, "something went wrong while feting Ai Generate Data");
        }
    }
}

export default ThingUShouldKnowService;