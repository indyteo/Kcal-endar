import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HealthGoalsEditScreen from "./HealthGoalsEditScreen";
import HealthGoalsProfileScreen from "./HealthGoalsProfileScreen";

export type HealthGoalsStackParamList = {
	Profile: undefined;
	Edit: undefined;
};

const HealthGoalsStack = createStackNavigator<HealthGoalsStackParamList>();

export function HealthGoals() {
	return (
		<HealthGoalsStack.Navigator>
			<HealthGoalsStack.Screen
				name="Profile"
				component={HealthGoalsProfileScreen}
				//options={{ headerShown: false }}
			/>
			<HealthGoalsStack.Screen
				name="Edit"
				component={HealthGoalsEditScreen}
				//options={{ header: FoodDatabaseDetailsHeader, ...TransitionPresets.SlideFromRightIOS }}
			/>
		</HealthGoalsStack.Navigator>
	);
}

export default HealthGoals;
