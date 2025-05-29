export class DescriptionSummaryDto {
    id: string;
    destinationName: string;
    destination: string;
    stateRegion: string;
    country: string;
    score: number;
    description: string;
    mainImage: string;

    constructor(data: any) {
        this.id = data.id || data._id;
        this.destinationName = data.destination_name;
        this.destination = data.destination;
        this.stateRegion = data.state_region;
        this.country = data.country;
        this.score = data.score;
        this.description = data.description;
        this.mainImage = data.main_image;
    }
}