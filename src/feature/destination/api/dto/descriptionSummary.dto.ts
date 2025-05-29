export class DescriptionSummaryDto {
    id: string;
    destination_name: string;
    destination: string;
    state_region: string;
    country: string;
    score: number;
    description: string;
    main_image: string;

    constructor(data: any) {
        this.id = data.id || data._id;
        this.destination_name = data.destination_name;
        this.destination = data.destination;
        this.state_region = data.state_region;
        this.country = data.country;
        this.score = data.score;
        this.description = data.description;
        this.main_image = data.main_image;
    }
}