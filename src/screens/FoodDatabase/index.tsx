import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";

import FoodDatabaseDetailsHeader from "./FoodDatabaseDetailsHeader";
import FoodDatabaseDetailsScreen from "./FoodDatabaseDetailsScreen";
import FoodDatabaseSearchScreen from "./FoodDatabaseSearchScreen";
import { FoodItem } from "../../utils/types";

export type FoodDatabaseStackParamList = {
	Search: undefined;
	Details: { item: FoodItem };
};

const FoodDatabaseStack = createStackNavigator<FoodDatabaseStackParamList>();

export function FoodDatabase() {
	return (
		<FoodDatabaseStack.Navigator>
			<FoodDatabaseStack.Screen name="Search" component={FoodDatabaseSearchScreen} options={{ headerShown: false }} />
			<FoodDatabaseStack.Screen
				name="Details"
				component={FoodDatabaseDetailsScreen}
				options={{ header: FoodDatabaseDetailsHeader, ...TransitionPresets.SlideFromRightIOS }}
			/>
		</FoodDatabaseStack.Navigator>
	);
}

export default FoodDatabase;
