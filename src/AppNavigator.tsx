import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Text, View } from "react-native";

const BottomTab = createMaterialBottomTabNavigator();

function AppNavigator() {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen name="Health Goals" component={HealthGoals} />
			<BottomTab.Screen name="Food Database" component={FoodDatabase} />
			<BottomTab.Screen name="Meal Planning" component={MealPlanning} />
		</BottomTab.Navigator>
	);
}

function HealthGoals() {
	return (
		<View>
			<Text>TODO</Text>
		</View>
	);
}

function FoodDatabase() {
	return (
		<View>
			<Text>TODO</Text>
		</View>
	);
}

function MealPlanning() {
	return (
		<View>
			<Text>TODO</Text>
		</View>
	);
}

export default AppNavigator;
