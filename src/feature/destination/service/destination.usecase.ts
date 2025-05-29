import { Document } from "mongoose";
import {
	AppError,
	catchErrorAsync,
	errorKinds,
} from "../../../utils/error-handling";
import { DescriptionSummaryDto } from "../api/dto/descriptionSummary.dto";
import { DestinationDocument } from "../models/destination.model";
import DestinationRepository from "../repository/destination.repository";

class DestinationUseCase {
	private repository: DestinationRepository;

	constructor() {
		this.repository = new DestinationRepository();
	}

	async get(destionationId: string) {
		const [err, data] = await catchErrorAsync(
			this.repository.getById({ id: destionationId })
		);
		if (err)
			throw AppError.new(
				errorKinds.internalServerError,
				"Error during retrieving data"
			);

		return data;
	}
	transformToDto(data: (Document & DestinationDocument)[]) {
		return data.map((item) => new DescriptionSummaryDto(item));
	}

	async getByFilter(search: string) {
		const [err, data] = await catchErrorAsync(
			this.repository.find({ search: search })
		);
		if (err)
			throw AppError.new(
				errorKinds.internalServerError,
				"Error during retrieving data"
			);
		if (!data || data.length === 0) {
			throw AppError.new(
				errorKinds.internalServerError,
				"Error during retrieving data"
			);
		}
		return this.transformToDto(data);
	}

	async getPopularDestination(params: {
		limit: number;
		orderBy: "asc" | "desc";
	}) {
		const { limit, orderBy } = params;
		const [err, data] = await catchErrorAsync(
			this.repository.getPopularDestination({ limit, orderBy })
		);
		if (err)
			throw AppError.new(
				errorKinds.internalServerError,
				"Error during retrieving data"
			);
		if (!data || data.length === 0) {
			throw AppError.new(
				errorKinds.internalServerError,
				"Error during retrieving data"
			);
		}
		return this.transformToDto(data);
	}

	async getFromNominatim(query: string) {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
			query
		)}&format=json&polygon_kml=1&addressdetails=2`;
		const [err, data] = await catchErrorAsync(
			(async () => {
				const response = await fetch(url, {
					headers: {
						"User-Agent": "Easy-Trip-Nodejs/1.0",
						Accept: "application/json",
					},
				});
				if (!response.ok) {
					throw new Error(`Nominatim API error: ${response.status}`);
				}
				return response.json();
			})()
		);
		if (err) {
			throw AppError.new(
				errorKinds.internalServerError,
				"Failed to fetch data from Nominatim API"
			);
		}
		return data.map((item: any) => ({
			name: item.name,
			display_name: item.display_name,
			importance: item.importance,
			type: item.type,
			address: item.address,
			latitude: item.lat,
			longitude: item.lon,
		}));
	}
}

const destinationUseCase = new DestinationUseCase();
export default destinationUseCase;
