import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { Appbar } from "react-native-paper";

import { useProfileContext } from "../../contexts/ProfileContext";
import { useProfileEditionContext } from "../../contexts/ProfileEditionContext";

export function FoodDatabaseDetailsHeader({ navigation }: StackHeaderProps) {
	const { profile, updateProfile } = useProfileContext();
	const edition = useProfileEditionContext();

	const hasProfile = profile !== null;
	const save = () => {
		updateProfile({
			birthdate: edition.birthdate!,
			gender: edition.gender!,
			height: edition.height,
			weight: edition.weight,
			activityLevel: edition.activityLevel!,
			healthGoal: edition.healthGoal!
		});
		if (hasProfile) navigation.navigate("Profile");
		else navigation.replace("Profile");
	};

	const edited =
		profile === null ||
		profile.birthdate !== edition.birthdate ||
		profile.gender !== edition.gender ||
		profile.height !== edition.height ||
		profile.weight !== edition.weight ||
		profile.activityLevel !== edition.activityLevel ||
		profile.healthGoal !== edition.healthGoal;
	const invalid =
		edition.birthdate === undefined ||
		edition.gender === undefined ||
		edition.height === 0 ||
		edition.weight === 0 ||
		edition.activityLevel === undefined ||
		edition.healthGoal === undefined;
	return (
		<Appbar.Header mode={hasProfile ? undefined : "center-aligned"} statusBarHeight={0} elevated>
			{hasProfile && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={hasProfile ? "Edit health goals" : "Setup health goals"} />
			<Appbar.Action
				icon={
					invalid ? "content-save-off-outline" : edited ? "content-save-edit-outline" : "content-save-check-outline"
				}
				onPress={save}
				disabled={invalid || !edited}
			/>
		</Appbar.Header>
	);
}

export default FoodDatabaseDetailsHeader;
