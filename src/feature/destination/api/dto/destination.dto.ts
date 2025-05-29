export class HighlightDto {
    name: string;
    description: string;
    url?: string | null;

    constructor(data: any) {
        this.name = data.name;
        this.description = data.description;
        this.url = data?.url || null;
    }
}

export class TravelInfoDto {
    best_time_to_visit: string | null;
    avg_daily_budget: string | null;
    climate: string | null;
    transport: string | null;

    constructor(data: any) {
        this.best_time_to_visit = data?.bestTimeToVisit;
        this.avg_daily_budget = data?.avgDailyBudget;
        this.climate = data?.climate;
        this.transport = data?.transport;
    }
}

export class LocationDto {
    lat: number | null;
    lng: number | null;

    constructor(data: any) {
        this.lat = data?.lat ?? null;
        this.lng = data?.lng ?? null;
    }
}

export class DestinationDto {
    id: string;
    destination_name: string;
    destination: string;
    state_region: string | null;
    country: string | null;
    score: number;
    description: string;
    main_image: string | null;
    highlights: HighlightDto[];
    travel_info: TravelInfoDto;
    location?: LocationDto;

    constructor(data: any) {
        this.id = data.id || data._id;
        this.destination_name = data.destination_name;
        this.destination = data.destination;
        this.state_region = data?.state_region || null;
        this.country = data?.country || null;
        this.score = data?.score;
        this.description = data?.description || null;
        this.main_image = data?.main_image || null;
        this.highlights = (data.highlights || []).map((h: any) => new HighlightDto(h));
        this.travel_info = new TravelInfoDto(data?.travel_info);
        this.location = new LocationDto(data?.location);
    }
}