interface FoodAPIParserResponse {
	_links: {
		next: {
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

export interface FoodItem {
	id: string;
	label: string;
	image: string;
	brand?: string;
	kcal: number;
	weight: number;
	kcalPer100g: number;
}

export class FoodSearchResults {
	private readonly nextUrl: string;
	readonly items: readonly FoodItem[];

	constructor(nextUrl: string, items: readonly FoodItem[]) {
		this.nextUrl = nextUrl;
		this.items = items;
	}

	fetchMore(): Promise<FoodSearchResults> {
		return fetch(this.nextUrl)
			.then<FoodAPIParserResponse>(res => res.json())
			.then(FoodSearchResults.fromAPI);
	}

	static fromAPI(apiResponse: FoodAPIParserResponse): FoodSearchResults {
		return new FoodSearchResults(
			apiResponse._links.next.href,
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

function filterByLabel<T extends { label?: string }>(array?: T[], label?: string): T | undefined {
	return array?.filter(element => element.label === label)[0];
}

export interface FoodNutrientsInfo {
	id: string;
	health: Filter[];
}

function getFilterFromAPI(health: string): Filter | null {
	const filter = health.replaceAll("_", "-").toLowerCase();
	return filter in foodFilters ? (filter as Filter) : null;
}

export type Filter =
	| "alcohol-free"
	| "celery-free"
	| "crustacean-free"
	| "dairy-free"
	| "egg-free"
	| "fish-free"
	| "gluten-free"
	| "keto-friendly"
	| "kosher"
	| "low-sugar"
	| "lupine-free"
	| "mustard-free"
	| "no-oil-added"
	| "paleo"
	| "peanut-free"
	| "pescatarian"
	| "pork-free"
	| "red-meat-free"
	| "sesame-free"
	| "shellfish-free"
	| "soy-free"
	| "tree-nut-free"
	| "vegan"
	| "vegetarian"
	| "wheat-free";

export interface FilterDisplay {
	label: string;
	icon: string;
}

export const foodFilters: Record<Filter, FilterDisplay> = {
	"alcohol-free": { label: "Alcohol-free", icon: "glass-cocktail-off" },
	"celery-free": { label: "Celery-free", icon: "leek" },
	"crustacean-free": { label: "Crustacean-free", icon: "fish-off" },
	"dairy-free": { label: "Dairy-free", icon: "cow-off" },
	"egg-free": { label: "Egg-free", icon: "egg-off-outline" },
	"fish-free": { label: "Fish-free", icon: "fish-off" },
	"gluten-free": { label: "Gluten-free", icon: "barley-off" },
	"keto-friendly": { label: "Keto friendly", icon: "fruit-cherries" },
	kosher: { label: "Kosher", icon: "food-kosher" },
	"low-sugar": { label: "Low sugar", icon: "spoon-sugar" },
	"lupine-free": { label: "Lupine-free", icon: "flower-outline" },
	"mustard-free": { label: "Mustard-free", icon: "chili-off" },
	"no-oil-added": { label: "No oil added", icon: "oil" },
	paleo: { label: "Paleo", icon: "bone" },
	"peanut-free": { label: "Peanut-free", icon: "peanut-off-outline" },
	pescatarian: { label: "Pescatarian", icon: "food-drumstick-off-outline" },
	"pork-free": { label: "Pork-free", icon: "food-steak-off" },
	"red-meat-free": { label: "Red meat-free", icon: "food-steak-off" },
	"sesame-free": { label: "Sesame-free", icon: "seed-off-outline" },
	"shellfish-free": { label: "Shellfish-free", icon: "fish-off" },
	"soy-free": { label: "Soy-free", icon: "soy-sauce" },
	"tree-nut-free": { label: "Tree nut-free", icon: "peanut-off-outline" },
	vegan: { label: "Vegan", icon: "carrot" },
	vegetarian: { label: "Vegetarian", icon: "leaf" },
	"wheat-free": { label: "Wheat-free", icon: "barley-off" }
};

const apiUrl = "https://api.edamam.com";
const appId = "f4bcf112";
const appKey = "542bf0d703cc2cba69c77d6c691db894";
const gramMeasureUri = "http://www.edamam.com/ontologies/edamam.owl#Measure_gram";

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
		body: JSON.stringify({
			ingredients: [
				{
					quantity: weight,
					measureURI: gramMeasureUri,
					foodId
				}
			]
		})
	})
		.then<FoodAPINutrientsResponse>(res => res.json())
		.then(res => ({
			id: foodId,
			health: res.healthLabels.map(getFilterFromAPI).filter((health): health is Filter => health !== null)
		}));
}

export function autoCompleteFood(text: string, results: number = 10): Promise<any> {
	const options = createOptions();
	options.set("q", text);
	options.set("limit", results.toString());
	return fetch(`${apiUrl}/auto-complete?${options}`).then(res => res.json());
}
