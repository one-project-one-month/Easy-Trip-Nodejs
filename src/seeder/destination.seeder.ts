import SeederModal from "../seeder/seederModal";
import destinationModel from "../feature/destination/models/destination.model";
import destinaionSeedData from "./destination.data";
import mongoose from "mongoose";
import ENV from "../config/custom-env";
import { connectDB } from "../config/db";

class DestinationSeeder extends SeederModal {
    private model: typeof destinationModel;
    constructor() {
        super();
        this.model = destinationModel;
    }
    async execute() {
        await connectDB(); 
        await destinationModel.deleteMany(); // Optional
        await destinationModel.insertMany(destinaionSeedData); // Actual seeding
        process.exit(0);
    }
}

export default DestinationSeeder;