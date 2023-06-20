import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { Appbar } from "react-native-paper";

import { Day, days } from "./index";

export function MealPlanningHeader({ navigation, route }: StackHeaderProps) {
	const day = route.name as Day;
	const indexOfDay = days.indexOf(day);

	return (
		<Appbar.Header statusBarHeight={0} elevated mode="center-aligned">
			<Appbar.Action
				icon="chevron-left"
				onPress={() => navigation.navigate(days[indexOfDay - 1])}
				disabled={indexOfDay === 0}
			/>
			<Appbar.Content title={day} />
			<Appbar.Action
				icon="chevron-right"
				onPress={() => navigation.navigate(days[indexOfDay + 1])}
				disabled={indexOfDay === days.length - 1}
			/>
		</Appbar.Header>
	);
}
