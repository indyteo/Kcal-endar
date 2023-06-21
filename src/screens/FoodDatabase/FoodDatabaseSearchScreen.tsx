import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Card, Divider, List, Text, useTheme } from "react-native-paper";

import AddToMealPlan from "./AddToMealPlan";
import { FoodDatabaseStackParamList } from "./index";
import FavoriteButton from "../../components/FavoriteButton";
import SearchBar from "../../components/SearchBar";
import SelectableChips from "../../components/SelectableChips";
import { useFavoritesContext } from "../../contexts/FavoritesContext";
import { usePlanningContext } from "../../contexts/PlanningContext";
import { loadFoodItems } from "../../services/AppStorage";
import { FoodSearchResults, searchFood } from "../../services/FoodDatabaseAPI";
import { foodFilters } from "../../utils/constants";
import { Filter, FoodItem } from "../../utils/types";

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

	const [search, setSearch] = useState<string>();
	const [searchFilters, setSearchFilters] = useState<Filter[]>([]);
	const [searchResults, setSearchResults] = useState<FoodSearchResults | null>();
	useEffect(() => {
		if (search) {
			searchFood(search, searchFilters)
				.then(setSearchResults)
				.catch(error => {
					console.error(error);
					setSearchResults(null);
				});
		} else setSearchResults(undefined);
	}, [search, searchFilters]);

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
			<SearchBar onSearch={setSearch} onClear={() => setSearch(undefined)}>
				<View>
					<SelectableChips
						options={Object.entries(foodFilters).map(([filter, display]) => ({ value: filter as Filter, ...display }))}
						selected={searchFilters}
						onToggle={(filter, selected) => {
							if (selected) setSearchFilters(searchFilters.concat(filter));
							else setSearchFilters(searchFilters.filter(f => f !== filter));
						}}
						multiple
						style={{ paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, gap: 10 }}
						chipStyle={({ selected }) => (selected ? undefined : { backgroundColor: "transparent" })}
					/>
				</View>
				{searchResults === undefined ? (
					<Text style={{ textAlign: "center", paddingTop: 50 }}>Type to search...</Text>
				) : searchResults === null ? (
					<Text style={{ textAlign: "center", paddingTop: 50 }}>Error</Text>
				) : searchResults.items.length === 0 ? (
					<Text style={{ textAlign: "center", paddingTop: 50 }}>No results</Text>
				) : (
					<FlatList
						data={searchResults.items}
						renderItem={({ item }) => (
							<List.Item
								title={item.label}
								description={item.brand ?? "Generic food item"}
								left={props => <List.Image {...props} source={{ uri: item.image }} />}
								right={props => (
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										<Text>{item.kcal} kcal</Text>
										<List.Icon {...props} icon="menu-right" />
									</View>
								)}
								onPress={() => navigation.navigate("Details", { item })}
							/>
						)}
						keyExtractor={item => item.id.toString()}
						keyboardDismissMode="on-drag"
						style={{ flex: 1 }}
					/>
				)}
			</SearchBar>
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
