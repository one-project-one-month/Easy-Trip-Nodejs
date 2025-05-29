import mongoose, { Schema, Document } from "mongoose";

interface Highlight {
  name: string;
  description: string;
  url?: string;
}

interface TravelInfo {
  bestTimeToVisit: string;
  avgDailyBudget: string;
  climate: string;
  transport: string;
}

interface Location {
  lat: number;
  lng: number;
}

export interface DestinationDocument extends Document {
  destination_name: string;
  destination: string;
  state_region: string;
  country: string;
  score: number;
  description: string;
  main_image: string;
  highlights: Highlight[];
  travel_info: TravelInfo;
  location: Location;
}

const HighlightSchema = new Schema<Highlight>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String }
});

const TravelInfoSchema = new Schema<TravelInfo>({
  bestTimeToVisit: { type: String, required: true },
  avgDailyBudget: { type: String, required: true },
  climate: { type: String, required: true },
  transport: { type: String, required: true }
});

const LocationSchema = new Schema<Location>({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const DestinationSchema = new Schema<DestinationDocument>({
  destination_name: { type: String, required: true },
  destination: { type: String, required: true },
  state_region: { type: String, required: true },
  country: { type: String, required: true },
  score: { type: Number, required: true },
  description: { type: String, required: true },
  main_image: { type: String },
  highlights: { type: [HighlightSchema], required: true },
  travel_info: { type: TravelInfoSchema, required: true },
  location: { type: LocationSchema, required: true }
});

export default mongoose.model<DestinationDocument>("Destination", DestinationSchema);