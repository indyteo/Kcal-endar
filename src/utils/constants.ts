import { Day, Filter, FilterDisplay, Meal } from "./types";

export const days: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const meals: Meal[] = ["Breakfast", "Lunch", "Snack", "Dinner"];
export const mealIcons: Record<Meal, string> = {
	Breakfast: "food-croissant",
	Lunch: "food-outline",
	Snack: "cookie-outline",
	Dinner: "pot-steam-outline"
};

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
