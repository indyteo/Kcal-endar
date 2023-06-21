import { foodFilters } from "../utils/constants";
import { filterByLabel } from "../utils/functions";
import { Filter, FoodItem, FoodNutrientsInfo } from "../utils/types";

const apiUrl = "https://api.edamam.com";
const appId = "f4bcf112";
const appKey = "542bf0d703cc2cba69c77d6c691db894";
const gramMeasureUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

interface FoodAPIParserResponse {
	_links?: {
		next?: {
			href: string;
		};
	};
	hints: {
		food: {
			foodId: string;
			brand?: string;
			image: string;
			label: string;
			nutrients: {
				ENERC_KCAL: number;
			};
			servingSizes?: {
				label: string;
				quantity: number;
			}[];
		};
		measures: {
			label: string;
			weight: number;
		}[];
	}[];
}

interface FoodAPINutrientsResponse {
	healthLabels: string[];
}

export class FoodSearchResults {
	private readonly nextUrl?: string;
	readonly items: readonly FoodItem[];

	constructor(nextUrl?: string, items: readonly FoodItem[] = []) {
		this.nextUrl = nextUrl;
		this.items = items;
	}

	get hasMore() {
		return this.nextUrl !== undefined;
	}

	fetchMore(): Promise<FoodSearchResults> {
		return this.hasMore
			? fetch(this.nextUrl!)
					.then<FoodAPIParserResponse>(res => res.json())
					.then(FoodSearchResults.fromAPI)
			: Promise.reject(new Error("No more results"));
	}

	static fromAPI(apiResponse: FoodAPIParserResponse): FoodSearchResults {
		return new FoodSearchResults(
			apiResponse._links?.next?.href,
			apiResponse.hints.map(item => {
				const weight =
					filterByLabel(item.food.servingSizes, "Gram")?.quantity ??
					filterByLabel(item.measures, "Serving")?.weight ??
					filterByLabel(item.measures, "Whole")?.weight ??
					100;
				return {
					id: item.food.foodId,
					label: item.food.label,
					image: item.food.image,
					brand: item.food.brand,
					kcal: Math.floor((weight * item.food.nutrients.ENERC_KCAL) / 100),
					weight,
					kcalPer100g: item.food.nutrients.ENERC_KCAL
				};
			})
		);
	}
}

function getFilterFromAPI(health: string): Filter | null {
	const filter = health.replaceAll("_", "-").toLowerCase();
	return filter in foodFilters ? (filter as Filter) : null;
}

function createOptions(): URLSearchParams {
	const options = new URLSearchParams();
	options.set("app_id", appId);
	options.set("app_key", appKey);
	return options;
}

export function searchFood(keyword: string, filters: readonly Filter[] = []): Promise<FoodSearchResults> {
	const options = createOptions();
	options.set("ingr", keyword);
	options.set("nutrition-type", "cooking");
	for (const filter of filters) options.append("health", filter);
	return fetch(`${apiUrl}/api/food-database/v2/parser?${options}`)
		.then<FoodAPIParserResponse>(res => res.json())
		.then(FoodSearchResults.fromAPI);
}

export function getFoodNutrients(foodId: string, weight: number = 100): Promise<FoodNutrientsInfo> {
	const options = createOptions();
	return fetch(`${apiUrl}/api/food-database/v2/nutrients?${options}`, {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ingredients: [{ quantity: weight, measureURI: gramMeasureUri, foodId }] })
	})
		.then<FoodAPINutrientsResponse>(res => res.json())
		.then(res => ({
			id: foodId,
			health: res.healthLabels.map(getFilterFromAPI).filter((health): health is Filter => health !== null)
		}));
}

export function autoCompleteFood(text: string, results: number = 10): Promise<string[]> {
	const options = createOptions();
	options.set("q", text);
	options.set("limit", results.toString());
	return fetch(`${apiUrl}/auto-complete?${options}`).then<string[]>(res => res.json());
}
