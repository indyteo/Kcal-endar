import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { List, Text } from "react-native-paper";

import SearchBar from "./SearchBar";
import SelectableChips from "./SelectableChips";
import { FoodSearchResults, searchFood } from "../services/FoodDatabaseAPI";
import { foodFilters } from "../utils/constants";
import { Filter, FoodItem } from "../utils/types";

export interface FoodSearchProps {
	viewOnly?: boolean;
	onResultSelected: (item: FoodItem) => void;
	onQuit?: () => void;
}

export function FoodSearch({ viewOnly, onResultSelected, onQuit }: FoodSearchProps) {
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

	return (
		<SearchBar onSearch={setSearch} onClear={() => setSearch(undefined)} onQuit={onQuit} viewOnly={viewOnly}>
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
				<Text style={{ textAlign: "center", paddingTop: 50 }}>An error occurred. Please try again later!</Text>
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
							onPress={() => onResultSelected(item)}
						/>
					)}
					keyExtractor={(item, index) => index + "-" + item.id}
					keyboardDismissMode="on-drag"
					style={{ flex: 1 }}
				/>
			)}
		</SearchBar>
	);
}

export default FoodSearch;
