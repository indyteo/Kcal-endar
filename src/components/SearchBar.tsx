import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Animated, TextInput, useAnimatedValue, View } from "react-native";
import { Divider, Searchbar, useTheme } from "react-native-paper";

type TextInputHandles = Pick<TextInput, "setNativeProps" | "isFocused" | "clear" | "blur" | "focus">;

export interface SearchBarProps extends PropsWithChildren {
	onSearch: (search: string) => void;
	onClear: () => void;
}

export function SearchBar({ children, onSearch, onClear }: SearchBarProps) {
	const theme = useTheme();
	const [search, setSearch] = useState("");
	const [isSearching, setSearching] = useState(false);
	const searchBarRef = useRef<TextInputHandles>(null);

	const searchDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const handleSearchTextChange = (newSearch: string) => {
		setSearch(newSearch);
		searchDebounceRef.current && clearTimeout(searchDebounceRef.current);
		if (newSearch) {
			searchDebounceRef.current = setTimeout(() => {
				searchDebounceRef.current = undefined;
				onSearch(newSearch);
			}, 500);
		} else onClear();
	};

	const [isSearchFocusAnimationFinished, setSearchFocusAnimationFinished] = useState(false);

	const margin = useAnimatedValue(15);
	const padding = useRef(Animated.subtract(15, margin)).current;
	const borderRadius = useRef(
		margin.interpolate({
			inputRange: [0, 15],
			outputRange: [0, theme.roundness * 7]
		})
	).current;
	const resultsHeight = useAnimatedValue(0);

	useEffect(() => {
		if (isSearching) {
			Animated.timing(margin, {
				toValue: 0,
				duration: 200 * theme.animation.scale,
				useNativeDriver: false
			}).start(({ finished }) => {
				Animated.timing(resultsHeight, {
					toValue: 100,
					duration: 400 * theme.animation.scale,
					useNativeDriver: false
				}).start();
				setSearchFocusAnimationFinished(finished);
			});
		} else {
			Animated.timing(resultsHeight, {
				toValue: 0,
				duration: 300 * theme.animation.scale,
				useNativeDriver: false
			}).start(() => {
				Animated.timing(margin, {
					toValue: 15,
					duration: 100 * theme.animation.scale,
					useNativeDriver: false
				}).start();
				setSearchFocusAnimationFinished(false);
			});
		}
	}, [isSearching]);

	return (
		<>
			<Animated.View
				style={
					isSearchFocusAnimationFinished
						? undefined
						: {
								backgroundColor: theme.colors.elevation.level3,
								margin,
								padding,
								borderRadius
						  }
				}
			>
				<Searchbar
					ref={searchBarRef}
					mode={isSearchFocusAnimationFinished ? "view" : "bar"}
					value={search}
					onChangeText={handleSearchTextChange}
					placeholder="Search food database"
					icon={isSearching ? "arrow-left" : "magnify"}
					onIconPress={() => {
						if (isSearching) {
							handleSearchTextChange("");
							setSearching(false);
							searchBarRef.current?.blur();
						} else setSearching(true);
					}}
					traileringIcon="microphone"
					onTraileringIconPress={() => console.log("Voice search")}
					onFocus={() => setSearching(true)}
					style={{
						paddingVertical: isSearchFocusAnimationFinished ? 7 : 0,
						paddingHorizontal: isSearchFocusAnimationFinished ? 15 : 0
					}}
					showDivider={false}
				/>
			</Animated.View>
			<View
				style={{
					position: "absolute",
					top: 86,
					right: 0,
					bottom: 0,
					left: 0,
					zIndex: isSearchFocusAnimationFinished ? 1 : -1
				}}
			>
				<Divider />
				<Animated.View
					style={{
						backgroundColor: theme.colors.elevation.level3,
						height: resultsHeight.interpolate({
							inputRange: [0, 100],
							outputRange: ["0%", "100%"]
						})
					}}
				>
					{children}
				</Animated.View>
			</View>
		</>
	);
}

export default SearchBar;
