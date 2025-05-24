import { AppError, errorKinds } from "../../../utils/error-handling";
import destinationModel from "../models/destination.model";

class DestinationRepository {
    async find({ search }: { search: string }) {
        try {
            const data = await destinationModel.find({
                $or: [
                    { destination_name: { $regex: search, $options: "i" } },
                    { state_region: { $regex: search, $options: "i" } },
                ],

            }).limit(5);
            return data;
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "internal Server Error");
        }
    }

    async findAndIncrementScore({ destinationId, score }: { destinationId: string, score: number }) {
        try {
            const data = await destinationModel.findOneAndUpdate(
                { _id: destinationId }, { $inc: { score } },
                { new: true }
            );
            return data;
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "internal Server Error");
        }
    }

    async getPopularDestination({ limit, orderBy }: { limit: number, orderBy: 'asc' | 'desc' }) {
        try {
            const data = await destinationModel.find().sort({ score: orderBy }).limit(limit);
            return data;
        } catch (error) {
            throw AppError.new(errorKinds.internalServerError, "internal Server Error");
        }
    }
}

export default DestinationRepository;