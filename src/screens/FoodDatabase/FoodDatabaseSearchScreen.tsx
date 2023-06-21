import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";

import { FoodDatabaseStackParamList } from "./index";
import AddToMealPlan from "../../components/AddToMealPlan";
import FavoriteButton from "../../components/FavoriteButton";
import FoodSearch from "../../components/FoodSearch";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { usePlanningContext } from "../../contexts/PlanningContext";
import { loadFoodItems } from "../../services/AppStorage";
import { FoodItem } from "../../utils/types";

function FoodCard({ item }: { item: FoodItem }) {
	const navigation = useNavigation<StackNavigationProp<FoodDatabaseStackParamList, "Search">>();
	return (
		<Card style={{ width: 350, margin: 15 }}>
			<TouchableOpacity onPress={() => navigation.navigate("Details", { item })} activeOpacity={0.75}>
				<Card.Cover source={{ uri: item.image }} />
			</TouchableOpacity>
			<Card.Title
				title={item.label}
				subtitle={`${item.kcal} kcal per ${item.weight}g`}
				right={() => <FavoriteButton item={item} />}
			/>
			<Card.Content style={{ paddingVertical: 15 }}>
				<Text>{item.brand ?? "Generic food item"}</Text>
			</Card.Content>
			<Card.Actions style={{ padding: 16 }}>
				<AddToMealPlan item={item} />
			</Card.Actions>
		</Card>
	);
}

export function FoodDatabaseSearchScreen({ navigation }: StackScreenProps<FoodDatabaseStackParamList, "Search">) {
	const theme = useTheme();

	const { favorites } = useFavoritesContext();
	const [favoriteItems, setFavoriteItems] = useState<FoodItem[]>([]);
	useEffect(() => {
		loadFoodItems(favorites)
			.then(Object.values)
			.then(fav => fav.filter(f => f !== null))
			.then(setFavoriteItems)
			.catch(console.error);
	}, [favorites]);

	const { planning } = usePlanningContext();
	const [planningItems, setPlanningItems] = useState<FoodItem[]>([]);
	useEffect(() => {
		if (planning === null) return;
		loadFoodItems(
			Object.values(planning)
				.flatMap(Object.values)
				.flat()
				.map(item => item.id)
		)
			.then(Object.values)
			.then(items => items.filter(f => f !== null))
			.then(setPlanningItems)
			.catch(console.error);
	}, [planning]);

	return (
		<View style={{ flex: 1 }}>
			<FoodSearch onResultSelected={item => navigation.navigate("Details", { item })} />
			<Divider />
			<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
				<Text variant="titleMedium" style={{ paddingHorizontal: 25 }}>
					Favorite items
				</Text>
				<FlatList
					data={favoriteItems}
					renderItem={props => <FoodCard {...props} />}
					keyExtractor={item => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, minWidth: "100%" }}
					ListEmptyComponent={
						<Text
							style={{ textAlign: "center", color: theme.colors.onSurfaceVariant, paddingVertical: 20, width: "100%" }}
						>
							Add items to favorites using the star icon
						</Text>
					}
				/>

				{/*<Text variant="titleMedium" style={{ paddingHorizontal: 25 }}>*/}
				{/*	Recently searched items*/}
				{/*</Text>*/}
				{/*<FlatList*/}
				{/*	data={recentSearchItems}*/}
				{/*	renderItem={props => <FoodCard {...props} />}*/}
				{/*	keyExtractor={item => item.id}*/}
				{/*	horizontal*/}
				{/*	showsHorizontalScrollIndicator={false}*/}
				{/*	contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, minWidth: "100%" }}*/}
				{/*	ListEmptyComponent={*/}
				{/*		<Text*/}
				{/*			style={{ textAlign: "center", color: theme.colors.onSurfaceVariant, paddingVertical: 20, width: "100%" }}*/}
				{/*		>*/}
				{/*			Find items added to your meal plan here*/}
				{/*		</Text>*/}
				{/*	}*/}
				{/*/>*/}

				<Text variant="titleMedium" style={{ paddingHorizontal: 25 }}>
					Items in your meal plan
				</Text>
				<FlatList
					data={planningItems}
					renderItem={props => <FoodCard {...props} />}
					keyExtractor={item => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10, minWidth: "100%" }}
					ListEmptyComponent={
						<Text
							style={{ textAlign: "center", color: theme.colors.onSurfaceVariant, paddingVertical: 20, width: "100%" }}
						>
							Find items added to your meal plan here
						</Text>
					}
				/>
				<View style={{ alignItems: "center", padding: 25 }}>
					<Image source={require("../../../assets/edamam-attribution.png")} style={{ width: 300, height: 60 }} />
				</View>
			</ScrollView>
		</View>
	);
}

export default FoodDatabaseSearchScreen;
