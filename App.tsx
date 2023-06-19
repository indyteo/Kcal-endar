import "react-native-gesture-handler";
import "url-search-params-polyfill";
import {
	DarkTheme as RawNavigationDarkTheme,
	DefaultTheme as RawNavigationDefaultTheme,
	NavigationContainer
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/AppNavigator";

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
	return (
		<PaperProvider theme={theme}>
			<NavigationContainer theme={isDarkMode ? NavigationDarkTheme : NavigationLightTheme}>
				<StatusBar />
				<SafeAreaView
					style={{
						backgroundColor: theme.colors.background,
						height: "100%"
					}}
				>
					<AppNavigator />
				</SafeAreaView>
			</NavigationContainer>
		</PaperProvider>
	);
}
