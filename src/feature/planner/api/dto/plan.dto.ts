export class PlanDto {
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

    constructor(data: any) {
        this.title = data?.title;
        this.description = data?.description;

        this.transportation = {
            local_pass: data.transportation?.local_pass ?? '',
            recommandation_info: Array.isArray(data.transportation?.recommandation_info)
                ? data?.transportation?.recommandation_info
                : [],
        };

        this.accomodation = {
            suggested_area: data.accomodation?.suggested_area ?? '',
            hotel_option: Array.isArray(data?.accomodation?.hotel_option)
                ? data.accomodation.hotel_option.map((hotel: any) => ({
                    name: hotel?.name,
                    price_per_night: hotel?.price_per_night,
                    link: hotel?.link,
                }))
                : [],
        };

        this.day_by_day_plan = Array.isArray(data.day_by_day_plan)
            ? data.day_by_day_plan.map((day: any) => ({
                day: day?.day,
                date: day?.date,
                title: day?.title,
                place: day?.place,
                description: day?.description,
                activities: Array.isArray(day?.activities) ? day.activities : [],
                estimated_day_budget: day?.estimated_day_budget,
            }))
            : [];

        this.budget_breakdown = {
            accommodation: data.budget_breakdown?.accommodation ?? 0,
            food: data.budget_breakdown?.food ?? 0,
            transport: data.budget_breakdown?.transport ?? 0,
            activities: data.budget_breakdown?.activities ?? 0,
            total_estimated: data.budget_breakdown?.total_estimated ?? 0,
            remaining_budget: data.budget_breakdown?.remaining_budget ?? 0,
            recommandation: data.budget_breakdown?.recommandation ?? '',
        };

        this.cultural_sensitivity_tips = Array.isArray(data.cultural_sensitivity_tips)
            ? data.cultural_sensitivity_tips
            : [];

        this.emergency_tips = {
            nearest_clinic: data.emergency_tips?.nearest_clinic ?? '',
            tourist_police: data.emergency_tips?.tourist_police ?? '',
            general_emergency: data.emergency_tips?.general_emergency ?? '',
            local_assistance: data.emergency_tips?.local_assistance ?? '',
        };

        this.conflict_with_festival = Boolean(data.conflict_with_festival);
        this.notes = Array.isArray(data.notes) ? data.notes : [];
    }
}
