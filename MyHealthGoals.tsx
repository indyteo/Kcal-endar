import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Chip } from "react-native-paper";

import EditHealthGoalsScreen from "./EditHealthGoalsScreen";
import { HealthGoalsContext } from "./HealthGoalsContext";

//interface HealthGoalsDisplayScreenProps {
//	data: FormData;
//}

interface FormData {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activityLevel: string;
	healthGoal: string;
}

const MyHealthGoals = () => {
	const { healthGoalsData } = useContext(HealthGoalsContext);
	const navigation = useNavigation();
	return (
		<View style={styles.chip}>
			<Text>Your profile</Text>
			<Chip icon="calendar" mode="flat">
				Age: {healthGoalsData?.age}
			</Chip>
			<Chip icon="account" mode="flat">
				Gender: {healthGoalsData?.gender}
			</Chip>
			<Chip mode="flat">Height: {healthGoalsData?.height}</Chip>
			<Chip mode="flat" icon="weight">
				Weight: {healthGoalsData?.weight}
			</Chip>
			<Chip mode="flat">Activity Level: {healthGoalsData?.activityLevel}</Chip>
			<Chip mode="flat">Health Goal: {healthGoalsData?.healthGoal}</Chip>
			<Text>Daily caloric intake target</Text>
			<Text>XXXX kcal</Text>
			<Text>Currently planned intake (daily average)</Text>
			<Text>XXXX kcal</Text>
			<Button onPress={() => console.log("go to edit page")}> Edit </Button>
		</View>
	);
};

export default MyHealthGoals;

const styles = StyleSheet.create({
	chip: {
		marginTop: 20,
		marginBottom: 10
	}
});
