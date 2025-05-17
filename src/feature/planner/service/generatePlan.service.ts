import { axiosCient } from "@/config/api-config";
import { ThingUShouldKnowType } from "../type";
import { AppError, errorKinds } from "@/utils/error-handling";

class GeneratePlanService<T extends Partial<ThingUShouldKnowType>>{
    private thingUShouldKnow: T;
    private prompt: any;
    private apiBaseConfig = {
        method: 'post',
        baseURL: "https://trip-plan-b6bq.onrender.com/trip/invoke",
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
            attendentsType
        } = promptObj;

        let prompt = JSON.stringify({
            "input": {
                "input": `
                    Trip Planning for this ${destination} with ${attendentsType} within ${startDate} to ${endDate} with ${budget} MMK
                `
            }
        });
        this.prompt = prompt;
        this.thingUShouldKnow = promptObj;
    }


    static setPrompt(promptObj: ThingUShouldKnowType) {
        return new GeneratePlanService(promptObj);
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
                .trim()
                // Remove leading or trailing Markdown fences if present
                .replace(/^```(?:json)?\s*/i, '')
                .replace(/```$/, '')
                // Remove escaped newline characters
                .replace(/\\n/g, '\n')
                // Remove unnecessary backslashes before double quotes
                .replace(/\\"/g, '"')
                // Remove commas from numbers (e.g., 1,000 → 1000)
                .replace(/(\d),(\d{3})/g, '$1$2')
                // Remove trailing commas before closing braces/brackets (illegal in JSON)
                .replace(/,\s*([}\]])/g, '$1');

            return JSON.parse(cleaned);

        } catch (error) {
            console.log(error)
            throw AppError.new(errorKinds.internalServerError, "something went wrong while feting Ai Generate Data");
        }
    }
}

export default GeneratePlanService;