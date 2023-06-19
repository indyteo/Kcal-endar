import AsyncStorage from "@react-native-async-storage/async-storage";

const favoriteStorageNamespace = "favorites.";
const favorites: Record<string, boolean> = {};

export function updateFavoriteFood(foodId: string, favorite: boolean): Promise<void> {
	favorites[foodId] = favorite;
	const storageKey = favoriteStorageNamespace + foodId;
	if (favorite) {
		return AsyncStorage.setItem(storageKey, "");
	} else {
		return AsyncStorage.removeItem(storageKey);
	}
}

export function isFavorite(foodId: string): Promise<boolean> {
	return AsyncStorage.getItem(favoriteStorageNamespace + foodId).then(value => value !== null);
}
