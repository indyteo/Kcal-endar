import React, { useEffect, useMemo, useState } from "react";
import { SectionList, View } from "react-native";
import { ActivityIndicator, Divider, FAB, IconButton, List, Text, useTheme } from "react-native-paper";

import AddToMealPlan from "../../components/AddToMealPlan";
import FoodSearch from "../../components/FoodSearch";
import { isExpired, usePlanningContext } from "../../contexts/PlanningContext";
import useBMR from "../../hooks/useBMR";
import { loadFoodItems } from "../../services/AppStorage";
import { meals } from "../../utils/constants";
import { Day, FoodItem, Meal, PlanningFoodItem } from "../../utils/types";

export interface MealPlanningScreenProps {
	day: Day;
}

export function MealPlanningScreen({ day }: MealPlanningScreenProps) {
	const theme = useTheme();
	const { planning, dispatchPlanning } = usePlanningContext();
	const [dailyPlanning, setDailyPlanning] = useState<{ meal: Meal; data: (FoodItem & PlanningFoodItem)[] }[]>();
	const [searchingFoodFor, setSearchingFoodFor] = useState<{ day: Day; meal?: Meal }>();
	const [addingItem, setAddingItem] = useState<FoodItem>();

	const dailyCalories = useMemo(
		() =>
			dailyPlanning?.reduce(
				(total, meal) => total + meal.data.reduce((subTotal, food) => subTotal + food.kcal * food.quantity, 0),
				0
			) ?? 0,
		[dailyPlanning]
	);
	const targetBMR = useBMR();

	useEffect(() => {
		if (planning === null) return;
		const planningOfDay = planning[day];
		loadFoodItems(
			Object.values(planningOfDay)
				.flat()
				.filter(item => !isExpired(item.date))
				.map(item => item.id)
		).then(foodItems =>
			setDailyPlanning(
				meals.map(meal => ({
					meal,
					data: planningOfDay[meal]
						.map(item => {
							const foodItem = foodItems[item.id];
							return foodItem === null ? null : { ...item, ...foodItem };
						})
						.filter((item): item is FoodItem & PlanningFoodItem => item !== null)
				}))
			)
		);
	}, [planning]);

	if (dailyPlanning === undefined) {
		return (
			<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}
	return (
		<View style={{ flex: 1, position: "relative" }}>
			{searchingFoodFor && (
				<FoodSearch onResultSelected={setAddingItem} onQuit={() => setSearchingFoodFor(undefined)} viewOnly />
			)}
			<AddToMealPlan
				item={addingItem ?? ({} as FoodItem)}
				defaultDay={searchingFoodFor?.day}
				defaultMeal={searchingFoodFor?.meal}
				controlledVisibility={addingItem !== undefined}
				onClose={() => {
					setAddingItem(undefined);
					setSearchingFoodFor(undefined);
				}}
			/>
			<View style={{ padding: 20, gap: 5 }}>
				<Text variant="titleLarge" style={{ paddingBottom: 15 }}>
					Planned caloric intake
				</Text>
				<Text variant="displayMedium" style={{ color: theme.colors.primary, textAlign: "center" }}>
					{dailyCalories} kcal
				</Text>
				<Text variant="titleLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
					Daily target: {targetBMR} kcal
				</Text>
			</View>
			<Divider />
			<SectionList
				sections={dailyPlanning}
				keyExtractor={item => item.id}
				renderSectionHeader={({ section: { meal } }) => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: theme.colors.background,
							paddingRight: 18
						}}
					>
						<Text variant="titleMedium" style={{ flex: 1, padding: 20 }}>
							{meal}
						</Text>
						<IconButton icon="plus" onPress={() => setSearchingFoodFor({ day, meal })} />
					</View>
				)}
				renderItem={({ item, section: { meal } }) => (
					<List.Item
						title={item.label}
						description={`x${item.quantity} • ${item.kcal * item.quantity} kcal`}
						left={props => <List.Image {...props} source={{ uri: item.image }} />}
						right={props => (
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								{item.date !== undefined && <Text>Extra</Text>}
								<IconButton
									{...props}
									icon="trash-can-outline"
									onPress={() => dispatchPlanning({ type: "remove_food", foodId: item.id, day, meal })}
								/>
							</View>
						)}
					/>
				)}
				renderSectionFooter={({ section: { data } }) =>
					data.length === 0 ? (
						<Text
							style={{
								textAlign: "center",
								color: theme.colors.onSurfaceVariant,
								paddingVertical: 20,
								width: "100%"
							}}
						>
							Nothing planned for this meal
						</Text>
					) : null
				}
			/>
			<FAB
				style={{ position: "absolute", right: 15, bottom: 15 }}
				icon="plus"
				onPress={() => setSearchingFoodFor({ day })}
			/>
		</View>
	);
}

export default MealPlanningScreen;
