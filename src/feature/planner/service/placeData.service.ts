
import { axiosCient } from "../../../config/api-config";
import { ThingUShouldKnowType } from "../type";
import { AppError, errorKinds } from "../../../utils/error-handling";


interface IPlaceData {
    place_id: string;
    name: string;
    display_name: string | null;
    address_type: string;
    geometry: {
        location: {
            lat: number | null;
            lng: number | null;
        };
    };
    address: {
        city: string | null;
        town: string | null;
        state: string | null;
        country: string | null;
        country_code: string | null;
    }
}

type PlaceDataType = {
    searchDestination: string;
}

export const getPlaceData = async (promptObj: PlaceDataType): Promise<IPlaceData | null> => {
    const { searchDestination } = promptObj;

    try {
        const response = await axiosCient
            .get<any[]>(`https://nominatim.openstreetmap.org/search?q=${searchDestination}&format=jsonv2&addressdetails=1`, {
                headers: {
                    'Accept-Language': 'en-US'
                }
            });
        // return response.data;
        const placeList = response.data;
        const placeDetail = placeList[0];
        if (placeList.length >= 1 && placeDetail) {
            return {
                place_id: placeDetail?.place_id,
                name: placeDetail?.name,
                display_name: placeDetail?.display_name || null,
                address_type: placeDetail?.address_type,
                geometry: {
                    location: {
                        lat: placeDetail.lat || null,
                        lng: placeDetail.lon || null
                    }
                },
                address: {
                    town: placeDetail.address?.town || null,
                    city: placeDetail.address?.city || null,
                    state: placeDetail.address?.state || null,
                    country: placeDetail.address?.country || null,
                    country_code: placeDetail.address?.country_code || null
                }
            }
            // throw AppError.new(errorKinds.notFound, "No place found");
        }
        return null;

    } catch (error) {
        throw AppError.new(errorKinds.internalServerError, "something went wrong while feting Place Data");
    }
}