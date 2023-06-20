import {
	createMaterialBottomTabNavigator,
	MaterialBottomTabNavigationOptions
} from "@react-navigation/material-bottom-tabs";
import React from "react";
import Icon from "react-native-paper/src/components/Icon";

import FoodDatabase from "./screens/FoodDatabase";
import HealthGoals from "./screens/HealthGoals";
import MealPlanning from "./screens/MealPlanning";

export type BottomTabParamList = {
	HealthGoals: undefined;
	FoodDatabase: undefined;
	MealPlanning: undefined;
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

function bottomTabOptions(
	label: string,
	unfocusedIcon: string,
	focusedIcon: string
): MaterialBottomTabNavigationOptions {
	return {
		tabBarLabel: label,
		tabBarIcon: ({ focused, color }) => <Icon size={24} color={color} source={focused ? focusedIcon : unfocusedIcon} />
	};
}

function AppNavigator() {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name="HealthGoals"
				component={HealthGoals}
				options={bottomTabOptions("Health Goals", "account-heart-outline", "account-heart")}
			/>
			<BottomTab.Screen
				name="FoodDatabase"
				component={FoodDatabase}
				options={bottomTabOptions("Food Database", "food-outline", "food")}
			/>
			<BottomTab.Screen
				name="MealPlanning"
				component={MealPlanning}
				options={bottomTabOptions("Meal Planning", "calendar-outline", "calendar")}
			/>
		</BottomTab.Navigator>
	);
}

export default AppNavigator;
