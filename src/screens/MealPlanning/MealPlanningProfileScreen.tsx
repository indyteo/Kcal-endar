import React from "react";
import { SectionList, View } from "react-native";
import { Divider, FAB, IconButton, List, Text, useTheme } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";

const DATA = [
	{
		title: "Breakfast",
		data: ["Pizza", "Burger", "Risotto"]
	},
	{
		title: "Lunch",
		data: ["French Fries", "Onion Rings", "Fried Shrimps"]
	},
	{
		title: "Snacks",
		data: ["Water", "Coke", "Beer"]
	},
	{
		title: "Dinner",
		data: ["Cheese Cake", "Ice Cream"]
	}
];

const MealPlanningProfileScreen = ({ day }: { day: string }) => {
	const theme = useTheme();
	return (
		<View style={{ flex: 1, position: "relative" }}>
			<View>
				<Text variant="titleLarge">Planned caloric intake</Text>
				<Text variant="displayMedium" style={{ color: theme.colors.primary }}>
					XXXX kcal
				</Text>
				<Text variant="titleLarge" style={{ color: theme.colors.onSurfaceVariant }}>
					Daily target: XXXX kcal
				</Text>
			</View>
			<Divider />
			<View style={{ flex: 1 }}>
				<SectionList
					sections={DATA}
					keyExtractor={(item, index) => item + index}
					renderItem={({ item }) => (
						<List.Item right={props => <List.Icon {...props} icon="menu-right" />} title={item} />
					)}
					renderSectionHeader={({ section: { title } }) => (
						<View style={{ flexDirection: "row" }}>
							<Text style={{ flex: 1 }}>{title}</Text>
							<IconButton icon="plus" onPress={() => console.log("oui")} />
						</View>
					)}
					ListFooterComponent={
						<View
							style={{
								flexDirection: "row",
								gap: 10,
								alignItems: "center",
								paddingHorizontal: 20,
								paddingVertical: 25
							}}
						>
							<Icon color={theme.colors.outline} size={24} source="archive-remove-outline" />
							<Text style={{ flex: 1, color: theme.colors.onSurfaceVariant }}>Pro-tip: Swipe to remove items!</Text>
						</View>
					}
				/>
			</View>
			<FAB style={{ position: "absolute", right: 15, bottom: 15 }} icon="plus" onPress={() => console.log("add it")} />
		</View>
	);
};

export default MealPlanningProfileScreen;
