import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IDestination extends Document {
    _id: ObjectId;
    destination_name: string;
    destination: string;
    state_region: string;
    country: string;
    score: number;
}

const DestinaionSchema: Schema = new Schema(
    {
        destination_name: { type: String, required: true },
        destination: { type: String, required: true },
        state_region: { type: String, required: true },
        country: { type: String, required: true },
        score: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IDestination>("Destination", DestinaionSchema);
