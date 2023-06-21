import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useMessagesContext } from "./MessagesContext";
import { loadFavorites, saveFavorites, saveFoodItem } from "../services/AppStorage";
import { noop } from "../utils/functions";
import { FoodItem } from "../utils/types";

export interface FavoritesContextType {
	favorites: string[];
	addToFavorites: (food: FoodItem) => void;
	removeFromFavorites: (foodId: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextType>({
	favorites: [],
	addToFavorites: noop,
	removeFromFavorites: noop
});

export const useFavoritesContext = () => useContext(FavoritesContext);

export function FavoritesContextProvider({ children }: PropsWithChildren) {
	const { dispatchMessage } = useMessagesContext();
	const [favorites, setFavorites] = useState<string[]>([]);

	const addToFavorites = useCallback(
		(food: FoodItem) => {
			const fav = favorites.concat(food.id);
			setFavorites(fav);
			dispatchMessage({ type: "save_begin" });
			saveFoodItem(food)
				.then(() => saveFavorites(fav))
				.then(() => dispatchMessage({ type: "save_end", message: "Food added to favorites" }))
				.catch(error => {
					console.error(error);
					dispatchMessage({ type: "save_end", message: "Unable to update favorites!" });
				});
		},
		[favorites]
	);

	const removeFromFavorites = useCallback(
		(foodId: string) => {
			const fav = favorites.filter(f => f !== foodId);
			setFavorites(fav);
			dispatchMessage({ type: "save_begin" });
			saveFavorites(fav)
				.then(() => dispatchMessage({ type: "save_end", message: "Food removed from favorites" }))
				.catch(error => {
					console.error(error);
					dispatchMessage({ type: "save_end", message: "Unable to update favorites!" });
				});
		},
		[favorites]
	);

	useEffect(() => {
		loadFavorites()
			.then(setFavorites)
			.catch(error => {
				console.error(error);
				dispatchMessage({ type: "send_message", message: "Unable to load favorites" });
			});
	}, []);

	const context = useMemo(() => ({ favorites, addToFavorites, removeFromFavorites }), [favorites]);
	return <FavoritesContext.Provider value={context} children={children} />;
}
