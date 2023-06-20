import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { MealPlanningHeader } from "./MealPlanningHeader";
import MealPlanningProfileScreen from "./MealPlanningProfileScreen";

export type MealPlanningStackParamList = {
	Monday: undefined;
	Tuesday: undefined;
	Wednesday: undefined;
	Thursday: undefined;
	Friday: undefined;
	Saturday: undefined;
	Sunday: undefined;
};
export type Day = keyof MealPlanningStackParamList;
export const days: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MealPlanningStack = createStackNavigator<MealPlanningStackParamList>();

export function MealPlanning() {
	let current = new Date().getDay(); // 0 is Sunday
	if (current === 0) current = 7;
	current--;
	const currentDay = days[current];
	return (
		<MealPlanningStack.Navigator initialRouteName={currentDay}>
			{days.map(day => (
				<MealPlanningStack.Screen key={day} name={day} options={{ header: MealPlanningHeader }}>
					{() => <MealPlanningProfileScreen day={day} />}
				</MealPlanningStack.Screen>
			))}
		</MealPlanningStack.Navigator>
	);
}

export default MealPlanning;
