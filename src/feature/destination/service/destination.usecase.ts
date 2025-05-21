import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import DestinationRepository from "../repository/destination.repository";

class DestinationUseCase {
    private repository: DestinationRepository;

    constructor() {
        this.repository = new DestinationRepository();
    }

    async getByFilter(search: string) {
        const [err, retrieveData] = await catchErrorAsync(this.repository.find({ search: search }));
        if (err) throw AppError.new(
            errorKinds.internalServerError,
            "Error during retrieving data"
        );

        return retrieveData;
    }

    async getPopularDestination(params: { limit: number, orderBy: 'asc' | 'desc' }) {
        const { limit, orderBy } = params;
        const [err, data] = await catchErrorAsync(this.repository.getPopularDestination({ limit, orderBy }));
        if (err) throw AppError.new(errorKinds.internalServerError, "Error during retrieving data");
        return data
    }
}

const destinationUseCase = new DestinationUseCase();
export default destinationUseCase;