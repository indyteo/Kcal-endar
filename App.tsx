import "react-native-gesture-handler";
import "url-search-params-polyfill";
import {
	DarkTheme as RawNavigationDarkTheme,
	DefaultTheme as RawNavigationDefaultTheme,
	NavigationContainer
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/AppNavigator";
import Messages from "./src/components/Messages";
import { FavoritesContextProvider } from "./src/contexts/FavoritesContext";
import { MessagesContextProvider } from "./src/contexts/MessagesContext";
import { PlanningContextProvider } from "./src/contexts/PlanningContext";
import { ProfileContextProvider } from "./src/contexts/ProfileContext";

const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
	reactNavigationLight: RawNavigationDefaultTheme,
	reactNavigationDark: RawNavigationDarkTheme,
	materialLight: MD3LightTheme,
	materialDark: MD3DarkTheme
});

export default function App() {
	const colorScheme = useColorScheme() ?? "light";
	const isDarkMode = colorScheme === "dark";
	const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

	useEffect(() => {
		registerTranslation("en", en);
	}, []);

	return (
		<PaperProvider theme={theme}>
			<NavigationContainer theme={isDarkMode ? NavigationDarkTheme : NavigationLightTheme}>
				<SafeAreaView
					style={{
						backgroundColor: theme.colors.background,
						height: "100%"
					}}
				>
					<MessagesContextProvider>
						<ProfileContextProvider>
							<PlanningContextProvider>
								<FavoritesContextProvider>
									<StatusBar />
									<AppNavigator />
									<Messages />
								</FavoritesContextProvider>
							</PlanningContextProvider>
						</ProfileContextProvider>
					</MessagesContextProvider>
				</SafeAreaView>
			</NavigationContainer>
		</PaperProvider>
	);
}
