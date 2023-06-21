import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";

import AddToMealPlan from "./AddToMealPlan";
import { FoodDatabaseStackParamList } from "./index";
import { getFoodNutrients } from "../../services/FoodDatabaseAPI";
import { foodFilters } from "../../utils/constants";
import { FoodNutrientsInfo } from "../../utils/types";

export function FoodDatabaseDetailsScreen({ route }: StackScreenProps<FoodDatabaseStackParamList, "Details">) {
	const theme = useTheme();
	const [foodHealth, setFoodHealth] = useState<FoodNutrientsInfo | null>();

	useEffect(() => {
		getFoodNutrients(route.params.item.id, route.params.item.weight)
			.then(setFoodHealth)
			.catch(error => {
				console.error(error);
				setFoodHealth(null);
			});
	}, [route.params.item]);

	const scrolling = useRef(new Animated.Value(0)).current;
	const imageOffset = scrolling.interpolate({
		inputRange: [0, 350],
		outputRange: [0, 175],
		extrapolate: "clamp"
	});

	return (
		<Animated.ScrollView
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrolling } } }], { useNativeDriver: true })}
		>
			<Animated.View style={{ height: 350, transform: [{ translateY: imageOffset }] }}>
				<ImageBackground source={{ uri: route.params.item.image }} resizeMode="cover" style={{ flex: 1 }} />
			</Animated.View>
			<View style={{ backgroundColor: theme.colors.background }}>
				<Text variant="headlineLarge" style={{ textAlign: "center", marginTop: 30, marginBottom: 10 }}>
					{route.params.item.kcal} kcal per unit ({route.params.item.weight}g)
				</Text>
				<Text variant="headlineSmall" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
					{route.params.item.brand ?? "Generic food item"}
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 25,
						paddingTop: 20,
						paddingBottom: 10,
						gap: 10
					}}
				>
					{foodHealth === undefined ? (
						<Text>Loading</Text>
					) : foodHealth === null ? (
						<Text>Error</Text>
					) : foodHealth.health.length === 0 ? null : (
						foodHealth.health.map(filter => {
							const display = foodFilters[filter];
							return (
								<Chip key={filter} icon={display.icon} mode="outlined">
									{display.label}
								</Chip>
							);
						})
					)}
				</ScrollView>
				<AddToMealPlan item={route.params.item} style={{ marginVertical: 25, alignSelf: "center" }} />
				<View
					style={{
						flexDirection: "row",
						gap: 10,
						paddingHorizontal: 25,
						paddingTop: 10,
						paddingBottom: 30,
						alignItems: "center"
					}}
				>
					<Icon color={theme.colors.outline} size={36} source="star-outline" />
					<Text variant="bodyLarge" style={{ flex: 1, color: theme.colors.onSurfaceVariant }}>
						Info: This food is one of your favorite and is listed on the food database main page!
					</Text>
				</View>
			</View>
			<Divider />
			<View style={{ height: 1000 }} />
		</Animated.ScrollView>
	);
}

export default FoodDatabaseDetailsScreen;
