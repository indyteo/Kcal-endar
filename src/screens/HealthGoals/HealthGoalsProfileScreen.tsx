import { StackScreenProps } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View } from "react-native";
import { Button, Chip, Text } from "react-native-paper";

import { HealthGoalsStackParamList } from "./index";
import { HealthGoalsContext } from "../../../HealthGoalsContext";

interface FormData {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activityLevel: string;
	healthGoal: string;
}

const HealthGoalsProfileScreen = ({ navigation }: StackScreenProps<HealthGoalsStackParamList, "Profile">) => {
	const { healthGoalsData } = useContext(HealthGoalsContext);
	return (
		<View>
			<Text>Your profile</Text>
			<Chip mode="outlined" icon="calendar">
				Age: {healthGoalsData?.age}
			</Chip>
			<Chip mode="outlined" icon="account-outline">
				Gender: {healthGoalsData?.gender}
			</Chip>
			<Chip mode="outlined" icon="human-male-height-variant">
				Height: {healthGoalsData?.height}
			</Chip>
			<Chip mode="outlined" icon="weight-kilogram">
				Weight: {healthGoalsData?.weight}
			</Chip>
			<Chip icon="dumbbell" mode="outlined">
				Activity Level: {healthGoalsData?.activityLevel}
			</Chip>
			<Chip icon="bullseye-arrow" mode="outlined">
				Health Goal: {healthGoalsData?.healthGoal}
			</Chip>
			<Text>Daily caloric intake target</Text>
			<Text>XXXX kcal</Text>
			<Text>Currently planned intake (daily average)</Text>
			<Text>XXXX kcal</Text>
			<Button onPress={() => navigation.navigate("Edit")}>Edit</Button>
		</View>
	);
};

export default HealthGoalsProfileScreen;
