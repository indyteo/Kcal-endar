import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { Appbar } from "react-native-paper";

import { FoodDatabaseStackParamList } from "./index";
import FavoriteButton from "../../components/FavoriteButton";

export function FoodDatabaseDetailsHeader({ navigation, route }: StackHeaderProps) {
	const item = (route.params as FoodDatabaseStackParamList["Details"]).item;
	return (
		<Appbar.Header statusBarHeight={0} elevated>
			<Appbar.BackAction onPress={navigation.goBack} />
			<Appbar.Content title={item.label} />
			<FavoriteButton item={item} />
		</Appbar.Header>
	);
}

export default FoodDatabaseDetailsHeader;
