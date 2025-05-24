import axiosClient from "config/axiosClient";
import { AppError, catchErrorAsync, errorKinds } from "../../../utils/error-handling";
import { Place } from "../type";
import { IPlaceDataRetriever } from "./placeDataRetrieval.service";

class NominatimPlaceService implements IPlaceDataRetriever {
    async fetchData(searchKeyword: string) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchKeyword
        )}&format=json&polygon_kml=1&addressdetails=2`;
        const [err, data] = await catchErrorAsync(
            (async () => {
                const response = await axiosClient.get(url, {
                    headers: {
                        "User-Agent": "Easy-Trip-Nodejs/1.0",
                        Accept: "application/json",
                    },
                });
                return response.data;
            })()
        );
        if(err) {
            console.log(err, "error")
            throw AppError.new(errorKinds.internalServerError, "Failed to fetch data from Nominatim API");
        }
        return data;
    }

    formatReturnData(data: any) {
        return {
            name: data.name,
            display_name: data.display_name || data.name,
            importance: data?.importance || 0,
            type: data.type || "unknown",
            latitude: data?.lat || null,
            longitude: data?.lon || null,
            address: data.address,
        };
    }

    async getList(serchKeyword: string): Promise<Place[]> {
        const data = await this.fetchData(serchKeyword);
        return data.map((item: any) => this.formatReturnData(item));
    }

    async get(searchKeyword?: string): Promise<Place> {
        const data = await this.fetchData(searchKeyword || "");
        return this.formatReturnData(data[0]);
    }
}

export default NominatimPlaceService;