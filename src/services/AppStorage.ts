import AsyncStorage from "@react-native-async-storage/async-storage";

import { FoodItem, Planning, Profile } from "../utils/types";

const profileStorageKey = "profile";
const planningStorageKey = "planning";
const favoritesStorageKey = "favorites";
const foodStorageNamespace = "food.";

export function loadProfile(): Promise<Profile | null> {
	return AsyncStorage.getItem(profileStorageKey).then(value => (value === null ? null : JSON.parse(value)));
}

export function saveProfile(profile: Profile | null): Promise<void> {
	return profile === null
		? AsyncStorage.removeItem(profileStorageKey)
		: AsyncStorage.setItem(profileStorageKey, JSON.stringify(profile));
}

export function loadPlanning(): Promise<Planning | null> {
	return AsyncStorage.getItem(planningStorageKey).then(value => (value === null ? null : JSON.parse(value)));
}

export function savePlanning(planning: Planning): Promise<void> {
	return AsyncStorage.setItem(planningStorageKey, JSON.stringify(planning));
}

export function loadFavorites(): Promise<string[]> {
	return AsyncStorage.getItem(favoritesStorageKey).then(value => (value === null ? [] : JSON.parse(value)));
}

export function saveFavorites(favorites: string[]): Promise<void> {
	return AsyncStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
}

export function loadFoodItem(foodId: string): Promise<FoodItem | null> {
	return AsyncStorage.getItem(foodStorageNamespace + foodId).then(value => (value === null ? null : JSON.parse(value)));
}

export function saveFoodItem(foodItem: FoodItem): Promise<void> {
	return AsyncStorage.setItem(foodStorageNamespace + foodItem.id, JSON.stringify(foodItem));
}

export function loadFoodItems<T extends string>(foodIds: T[]): Promise<Record<T, FoodItem | null>> {
	return AsyncStorage.multiGet(foodIds.map(id => foodStorageNamespace + id)).then(values => {
		const foods = {} as Record<T, FoodItem | null>;
		for (const [foodId, foodItem] of values) {
			foods[foodId.substring(foodStorageNamespace.length) as T] = foodItem === null ? null : JSON.parse(foodItem);
		}
		return foods;
	});
}

export function removeFoodItems(foodIds: string[]): Promise<void> {
	return AsyncStorage.multiRemove(foodIds.map(id => foodStorageNamespace + id));
}
