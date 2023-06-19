import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { FlatList, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, Card, Chip, Divider, List, Text, useTheme } from "react-native-paper";

import { FoodDatabaseStackParamList } from "./index";
import IconToggleButton from "../../components/IconToggleButton";
import SearchBar from "../../components/SearchBar";
import { foodFilters, FoodItem, FoodSearchResults, searchFood } from "../../services/FoodDatabaseAPI";

function FoodCard() {
	const theme = useTheme();
	const navigation = useNavigation<StackNavigationProp<FoodDatabaseStackParamList, "Search">>();
	const [favorite, setFavorite] = useState(false);
	return (
		<Card style={{ width: 350, margin: 15 }}>
			<TouchableOpacity onPress={() => navigation.navigate("Details", { item: {} as FoodItem })} activeOpacity={0.75}>
				<Card.Cover source={{ uri: "invalid.png" }} />
			</TouchableOpacity>
			<Card.Title
				title="Banana"
				subtitle="267 kcal"
				right={props => (
					<IconToggleButton
						{...props}
						toggled={favorite}
						onToggle={setFavorite}
						iconOn="star"
						iconOff="star-outline"
						iconColorOn={theme.colors.primary}
						iconColorOff={theme.colors.onSurfaceVariant}
					/>
				)}
			/>
			<Card.Content style={{ paddingVertical: 15 }}>
				<Text>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aut fugiat illum labore nemo, non quisquam unde?
					Cum exercitationem fugit hic iste maxime modi obcaecati porro, quibusdam ratione repudiandae voluptatum.
				</Text>
			</Card.Content>
			<Card.Actions style={{ padding: 16 }}>
				<Button onPress={() => console.log("Add to meal plan")} mode="contained">
					Add to meal plan
				</Button>
			</Card.Actions>
		</Card>
	);
}

export function FoodDatabaseSearchScreen({ navigation }: StackScreenProps<FoodDatabaseStackParamList, "Search">) {
	const theme = useTheme();
	const [searchResults, setSearchResults] = useState<FoodSearchResults | null>();

	return (
		<View style={{ flex: 1 }}>
			<SearchBar
				onSearch={search => {
					searchFood(search)
						.then(setSearchResults)
						.catch(error => {
							console.error(error);
							setSearchResults(null);
						});
				}}
				onClear={() => setSearchResults(undefined)}
			>
				<View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							paddingHorizontal: 15,
							paddingTop: 15,
							paddingBottom: 10,
							gap: 10
						}}
					>
						{Object.entries(foodFilters).map(([filter, display]) => (
							<Chip key={filter} icon={display.icon} mode="outlined" style={{ backgroundColor: "transparent" }}>
								{display.label}
							</Chip>
						))}
					</ScrollView>
				</View>
				{searchResults === undefined ? (
					<Text>Type to search</Text>
				) : searchResults === null ? (
					<Text>Error</Text>
				) : searchResults.items.length === 0 ? (
					<Text>No results</Text>
				) : (
					<FlatList
						data={searchResults.items}
						renderItem={({ item }) => (
							<List.Item
								title={item.label}
								description="Generic food item"
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
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 }}
				>
					<FoodCard />
					<FoodCard />
					<FoodCard />
					<FoodCard />
				</ScrollView>
				<Text variant="titleMedium" style={{ paddingHorizontal: 25 }}>
					Recently searched items
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 }}
				>
					<FoodCard />
					<FoodCard />
					<FoodCard />
					<FoodCard />
				</ScrollView>
				<Text variant="titleMedium" style={{ paddingHorizontal: 25 }}>
					Items in your meal plan
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ flexDirection: "row", paddingVertical: 10, paddingHorizontal: 10 }}
				>
					<FoodCard />
					<FoodCard />
					<FoodCard />
					<FoodCard />
				</ScrollView>
				<View style={{ alignItems: "center", padding: 25 }}>
					<Image source={require("../../../assets/edamam-attribution.png")} style={{ width: 300, height: 60 }} />
				</View>
			</ScrollView>
		</View>
	);
}

export default FoodDatabaseSearchScreen;
