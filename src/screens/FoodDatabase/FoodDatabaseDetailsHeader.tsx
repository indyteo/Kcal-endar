import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

import { FoodDatabaseStackParamList } from "./index";
import IconToggleButton from "../../components/IconToggleButton";

export function FoodDatabaseDetailsHeader({ navigation, route }: StackHeaderProps) {
	const theme = useTheme();
	return (
		<Appbar.Header statusBarHeight={0} elevated>
			<Appbar.BackAction onPress={navigation.goBack} />
			<Appbar.Content title={(route.params as FoodDatabaseStackParamList["Details"]).item?.label ?? "Food item"} />
			<IconToggleButton
				toggled={false}
				onToggle={() => {}}
				iconOn="star"
				iconOff="star-outline"
				iconColorOn={theme.colors.primary}
				iconColorOff={theme.colors.onSurfaceVariant}
			/>
		</Appbar.Header>
	);
}

export default FoodDatabaseDetailsHeader;
