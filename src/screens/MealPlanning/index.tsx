import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { MealPlanningHeader } from "./MealPlanningHeader";
import MealPlanningScreen from "./MealPlanningScreen";
import { days } from "../../utils/constants";
import { getCurrentDay } from "../../utils/functions";
import { Day } from "../../utils/types";

export type MealPlanningStackParamList = Record<Day, undefined>;
const MealPlanningStack = createStackNavigator<MealPlanningStackParamList>();

export function MealPlanning() {
	return (
		<MealPlanningStack.Navigator initialRouteName={getCurrentDay()}>
			{days.map(day => (
				<MealPlanningStack.Screen key={day} name={day} options={{ header: MealPlanningHeader }}>
					{() => <MealPlanningScreen day={day} />}
				</MealPlanningStack.Screen>
			))}
		</MealPlanningStack.Navigator>
	);
}

export default MealPlanning;
