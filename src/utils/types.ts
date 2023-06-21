export interface FoodItem {
	id: string;
	label: string;
	image: string;
	brand?: string;
	kcal: number;
	weight: number;
	kcalPer100g: number;
}

export interface FoodNutrientsInfo {
	id: string;
	health: Filter[];
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

export type Gender = "male" | "female";
export type ActivityLevel = "sedentary" | "light_exercise" | "moderate_exercise" | "heavy_exercise" | "extra_active";
export type HealthGoal = "weight_loss" | "weight_maintenance" | "weight_gain";

export interface Profile {
	birthdate: number;
	gender: Gender;
	height: number;
	weight: number;
	activityLevel: ActivityLevel;
	healthGoal: HealthGoal;
}

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type Meal = "Breakfast" | "Lunch" | "Snack" | "Dinner";

export interface PlanningFoodItem {
	id: string;
	date?: number;
	quantity: number;
}
export type Planning = Record<Day, Record<Meal, PlanningFoodItem[]>>;
