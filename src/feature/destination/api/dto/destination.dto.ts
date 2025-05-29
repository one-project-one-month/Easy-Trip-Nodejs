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
    bestTimeToVisit: string| null;
    avgDailyBudget: string | null;
    climate: string | null;
    transport: string | null;

    constructor(data: any) {
        this.bestTimeToVisit = data?.bestTimeToVisit;
        this.avgDailyBudget = data?.avgDailyBudget;
        this.climate = data?.climate;
        this.transport = data?.transport;
    }
}

export class LocationDto {
    lat: number | null;
    lng: number | null ;

    constructor(data: any) {
        this.lat = data?.lat || null;
        this.lng = data?.lng || null;
    }
}

export class DestinationDto {
    id: string;
    destinationName: string;
    destination: string;
    stateRegion: string | null;
    country: string | null;
    score: number;
    description: string;
    mainImage: string | null;
    highlights: HighlightDto[];
    travelInfo: TravelInfoDto;
    location?: LocationDto;

    constructor(data: any) {
        this.id = data.id || data._id;
        this.destinationName = data.destination_name;
        this.destination = data.destination;
        this.stateRegion = data?.state_region || null;
        this.country = data.country || null;
        this.score = data.score;
        this.description = data.description || null;
        this.mainImage = data?.main_image;
        this.highlights = (data.highlights || []).map((h: any) => new HighlightDto(h));
        this.travelInfo = new TravelInfoDto(data?.travel_info);
        this.location = new LocationDto(data?.location);
    }
}