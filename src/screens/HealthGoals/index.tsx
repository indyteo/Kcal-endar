import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import { Appbar } from "react-native-paper";

import HealthGoalsEditHeader from "./HealthGoalsEditHeader";
import HealthGoalsEditScreen from "./HealthGoalsEditScreen";
import HealthGoalsProfileScreen from "./HealthGoalsProfileScreen";
import { useProfileContext } from "../../contexts/ProfileContext";
import { ProfileEditionContextProvider } from "../../contexts/ProfileEditionContext";

export type HealthGoalsStackParamList = {
	Profile: undefined;
	Edit: undefined;
};

const HealthGoalsStack = createStackNavigator<HealthGoalsStackParamList>();

export function HealthGoals() {
	const { profile } = useProfileContext();
	return (
		<ProfileEditionContextProvider profile={profile}>
			<HealthGoalsStack.Navigator initialRouteName={profile === null ? "Edit" : "Profile"}>
				<HealthGoalsStack.Screen
					name="Profile"
					component={HealthGoalsProfileScreen}
					options={{
						header: ({ navigation }) => (
							<Appbar.Header mode="center-aligned" statusBarHeight={0} elevated>
								<Appbar.Content title="My health goals" />
								<Appbar.Action icon="pencil-outline" onPress={() => navigation.navigate("Edit")} />
							</Appbar.Header>
						)
					}}
				/>
				<HealthGoalsStack.Screen
					name="Edit"
					component={HealthGoalsEditScreen}
					options={{ header: HealthGoalsEditHeader, ...TransitionPresets.SlideFromRightIOS }}
				/>
			</HealthGoalsStack.Navigator>
		</ProfileEditionContextProvider>
	);
}

export default HealthGoals;
