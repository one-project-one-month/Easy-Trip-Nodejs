export type Place = {
    name: string;
    display_name: string;
    importance: number;
    type: string;
    address: {
        city?: string;
        municipality?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
        [key: string]: any; // Optional: allows for extra fields like ISO codes
    };
    latitude: string;
    longitude: string;
};