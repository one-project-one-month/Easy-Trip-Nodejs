import { catchErrorAsync, errorKinds, AppError } from "../../../utils/error-handling";
import { Place } from "../type";

export interface IPlaceDataRetriever {
    getList(serchKeyword: string): Promise<Place[]>;
    get(serchKeyword: string): Promise<Place>;
}

class PlaceDataRetrievalService {
    constructor(private retriver: IPlaceDataRetriever) {}

    async execute(serchKeyword: string) {
        const [err, data] = await catchErrorAsync(this.retriver.get(serchKeyword));
        if (err) throw AppError.new(errorKinds.internalServerError, "Error on retrieving data");
        return data;
    }
}

export default PlaceDataRetrievalService;