import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";

import { HealthGoalsStackParamList } from "./index";
import { useProfileContext } from "../../contexts/ProfileContext";
import useAge from "../../hooks/useAge";
import useBMR from "../../hooks/useBMR";
import { ActivityLevel, Gender, HealthGoal } from "../../utils/types";

const genders: Record<Gender, string> = {
	male: "Male",
	female: "Female"
};

const activityLevels: Record<ActivityLevel, string> = {
	sedentary: "Sedentary",
	light_exercise: "Light exercise",
	moderate_exercise: "Moderate exercise",
	heavy_exercise: "Heavy exercise",
	extra_active: "Extra active"
};

const healthGoals: Record<HealthGoal, string> = {
	weight_loss: "Lose weight",
	weight_maintenance: "Maintain weight",
	weight_gain: "Gain weight"
};

const HealthGoalsProfileScreen = ({ navigation }: StackScreenProps<HealthGoalsStackParamList, "Profile">) => {
	const theme = useTheme();
	const { profile } = useProfileContext();
	const age = useAge();
	const bmr = useBMR();

	useEffect(() => {
		if (profile === null) navigation.navigate("Edit");
	}, [profile]);
	if (profile === null) return null;
	return (
		<ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 25, gap: 25 }}>
			<Text variant="titleMedium">Your profile</Text>
			<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
				<Chip mode="outlined" icon="calendar">
					{age} y.o.
				</Chip>
				<Chip mode="outlined" icon="account-outline">
					{genders[profile.gender]}
				</Chip>
				<Chip mode="outlined" icon="human-male-height-variant">
					{profile.height} cm
				</Chip>
				<Chip mode="outlined" icon="weight-kilogram">
					{profile.weight} kg
				</Chip>
				<Chip icon="dumbbell" mode="outlined">
					{activityLevels[profile.activityLevel]}
				</Chip>
				<Chip icon="bullseye-arrow" mode="outlined">
					{healthGoals[profile.healthGoal]}
				</Chip>
			</View>
			<Text variant="titleMedium">Daily caloric intake target</Text>
			<Text variant="displayLarge" style={{ textAlign: "center", color: theme.colors.primary }}>
				{bmr} kcal
			</Text>
			<Text variant="titleMedium">Currently planned intake (daily average)</Text>
			<Text variant="displayLarge" style={{ textAlign: "center", color: theme.colors.error }}>
				XXXX kcal
			</Text>
			<View style={{ flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
				<Icon color={theme.colors.outline} size={36} source="alert-circle-outline" />
				<Text style={{ flex: 1, color: theme.colors.onSurfaceVariant }}>
					Your currently planned caloric intake does not match your target! You are XXX kcal over your goal. You should
					consider reviewing your current planning to remove some food.
				</Text>
			</View>
		</ScrollView>
	);
};

export default HealthGoalsProfileScreen;
