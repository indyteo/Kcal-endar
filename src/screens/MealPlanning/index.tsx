import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import { MealPlanningHeader } from "./MealPlanningHeader";
import MealPlanningScreen from "./MealPlanningScreen";
import { days } from "../../utils/constants";
import { getCurrentDay } from "../../utils/functions";
import { Day } from "../../utils/types";

export type MealPlanningTabParamList = Record<Day, undefined>;
const MealPlanningTab = createMaterialTopTabNavigator<MealPlanningTabParamList>();

export function MealPlanning() {
	const currentDay = getCurrentDay();
	return (
		<MealPlanningTab.Navigator initialRouteName={currentDay} tabBar={props => <MealPlanningHeader {...props} />}>
			{days.map(day => (
				<MealPlanningTab.Screen key={day} name={day}>
					{() => <MealPlanningScreen day={day} />}
				</MealPlanningTab.Screen>
			))}
		</MealPlanningTab.Navigator>
	);
}

export default MealPlanning;
