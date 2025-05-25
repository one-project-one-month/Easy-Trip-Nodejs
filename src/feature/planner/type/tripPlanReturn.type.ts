import { Place } from "../../../feature/place/type";

export type TripPlanReturnType = {
    title: string;
    description: string;
    transportation: {
        local_pass: string;
        recommandation_info: string[];
    };
    accomodation: {
        suggested_area: string;
        hotel_option: {
            name: string;
            price_per_night: number;
            link: string;
        }[];
    };
    day_by_day_plan: {
        day: number;
        date: string;
        title: string;
        place: string;
        description: string;
        activities: string[];
        estimated_day_budget: number;
    }[];
    budget_breakdown: {
        accommodation: number;
        food: number;
        transport: number;
        activities: number;
        total_estimated: number;
        remaining_budget: number;
        recommandation: string;
    };
    cultural_sensitivity_tips: string[];
    emergency_tips: {
        nearest_clinic: string;
        tourist_police: string;
        general_emergency: string;
        local_assistance: string;
    };
    conflict_with_festival: boolean;
    notes: string[];
};

export type GeneratedTripPlan = {
    place_detail: Place;
    generate_data: TripPlanReturnType;
}
