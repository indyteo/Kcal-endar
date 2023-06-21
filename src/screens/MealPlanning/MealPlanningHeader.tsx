import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { Appbar } from "react-native-paper";

import { days } from "../../utils/constants";
import { getCurrentDay } from "../../utils/functions";
import { Day } from "../../utils/types";

export function MealPlanningHeader({ navigation, route }: StackHeaderProps) {
	const day = route.name as Day;
	const dayIndex = days.indexOf(day);
	const isToday = day === getCurrentDay();
	return (
		<Appbar.Header statusBarHeight={0} elevated mode="center-aligned">
			<Appbar.Action
				icon="chevron-left"
				onPress={() => navigation.navigate(days[dayIndex - 1])}
				disabled={dayIndex === 0}
			/>
			<Appbar.Content title={isToday ? day + " (today)" : day} />
			<Appbar.Action
				icon="chevron-right"
				onPress={() => navigation.navigate(days[dayIndex + 1])}
				disabled={dayIndex === days.length - 1}
			/>
		</Appbar.Header>
	);
}
