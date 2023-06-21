import React from "react";
import { useTheme } from "react-native-paper";

import IconToggleButton from "./IconToggleButton";
import { useFavoritesContext } from "../contexts/FavoritesContext";
import { FoodItem } from "../utils/types";

export interface FavoriteButtonProps {
	item: FoodItem;
}

export function FavoriteButton({ item }: FavoriteButtonProps) {
	const theme = useTheme();
	const { favorites, addToFavorites, removeFromFavorites } = useFavoritesContext();
	return (
		<IconToggleButton
			toggled={favorites.includes(item.id)}
			onToggle={favorite => (favorite ? addToFavorites(item) : removeFromFavorites(item.id))}
			iconOn="star"
			iconOff="star-outline"
			iconColorOn={theme.colors.primary}
			iconColorOff={theme.colors.onSurfaceVariant}
		/>
	);
}

export default FavoriteButton;
