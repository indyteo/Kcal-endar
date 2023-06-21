import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, HelperText, Portal, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import Icon from "react-native-paper/src/components/Icon";
import { DatePickerInput } from "react-native-paper-dates";

import SelectableChips from "../../components/SelectableChips";
import { useProfileContext } from "../../contexts/ProfileContext";
import { useProfileEditionContext } from "../../contexts/ProfileEditionContext";
import { useAnimatedSlide } from "../../hooks/useAnimatedSlide";
import { Gender, HealthGoal } from "../../utils/types";

function HealthGoalsEditScreen() {
	const theme = useTheme();
	const {
		birthdate,
		gender,
		height,
		weight,
		activityLevel,
		healthGoal,
		setBirthdate,
		setGender,
		setHeight,
		setWeight,
		setActivityLevel,
		setHealthGoal
	} = useProfileEditionContext();
	const { profile, updateProfile } = useProfileContext();
	const [confirmResetProfile, setConfirmResetProfile] = useState(false);
	const animatedSlide = useAnimatedSlide("bottom", confirmResetProfile);

	return (
		<ScrollView contentContainerStyle={{ paddingVertical: 25, gap: 25 }}>
			<View style={{ paddingHorizontal: 20, gap: 25 }}>
				<Text variant="titleMedium">Physical characteristics</Text>
				<View>
					<DatePickerInput
						locale="en"
						label="Birthdate"
						value={birthdate === undefined ? undefined : new Date(birthdate)}
						onChange={date => setBirthdate(date?.getTime())}
						inputMode="start"
						mode="outlined"
						withDateFormatInLabel={false}
						uppercase={false}
						startYear={1900}
						endYear={new Date().getFullYear()}
					/>
					<HelperText type="info">MM/DD/YYYY</HelperText>
				</View>
				<SegmentedButtons
					buttons={[
						{ label: "Male", value: "male", icon: "gender-male", showSelectedCheck: true },
						{ label: "Female", value: "female", icon: "gender-female", showSelectedCheck: true }
					]}
					value={gender ?? ""}
					onValueChange={g => setGender(g === "" ? undefined : (g as Gender))}
				/>
				<TextInput
					label="Height"
					value={height === 0 ? "" : height.toString()}
					onChangeText={text => setHeight(parseInt(text, 10))}
					keyboardType="numeric"
					mode="outlined"
					right={<TextInput.Affix text="cm" />}
				/>
				<TextInput
					label="Weight"
					value={weight === 0 ? "" : weight.toString()}
					onChangeText={text => setWeight(parseInt(text, 10))}
					keyboardType="numeric"
					mode="outlined"
					right={<TextInput.Affix text="kg" />}
				/>
				<Text variant="titleMedium">Activity Level</Text>
				<View style={{ paddingLeft: 5, gap: 5 }}>
					<Text>• Sedentary: little or no exercise</Text>
					<Text>• Light exercise: 1-3 days/week</Text>
					<Text>• Moderate exercise: 3-5 days/week</Text>
					<Text>• Heavy exercise: 6-7 days a week</Text>
					<Text>• Extra active: physical job & exercise 2x/day</Text>
				</View>
			</View>
			<SelectableChips
				options={[
					{ label: "Sedentary", value: "sedentary" },
					{ label: "Light exercise", value: "light_exercise" },
					{ label: "Moderate exercise", value: "moderate_exercise" },
					{ label: "Heavy exercise", value: "heavy_exercise" },
					{ label: "Extra active", value: "extra_active" }
				]}
				selected={activityLevel}
				onSelect={setActivityLevel}
				style={{ paddingHorizontal: 20, gap: 10 }}
			/>
			<View style={{ paddingHorizontal: 20, gap: 25 }}>
				<Text variant="titleMedium">Health Goal</Text>
				<Text>What is your objective regarding your weight?</Text>
				<SegmentedButtons
					buttons={[
						{ label: "Lose", value: "weight_loss", icon: "trending-down", showSelectedCheck: true },
						{ label: "Maintain", value: "weight_maintenance", icon: "trending-neutral", showSelectedCheck: true },
						{ label: "Gain", value: "weight_gain", icon: "trending-up", showSelectedCheck: true }
					]}
					value={healthGoal ?? ""}
					onValueChange={h => setHealthGoal(h === "" ? undefined : (h as HealthGoal))}
				/>
				<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
					<Icon color={theme.colors.outline} size={24} source="sticker-emoji" />
					<Text style={{ flex: 1, color: theme.colors.onSurfaceVariant }}>
						Everything is stored locally on your device and used only to compute your health goals. Nobody knows about
						the data you entered here.
					</Text>
				</View>
				{profile !== null && (
					<Button mode="text" onPress={() => setConfirmResetProfile(true)} style={{ alignSelf: "center" }}>
						Reset my profile
					</Button>
				)}
			</View>
			<Portal>
				<Dialog
					visible={animatedSlide.visible}
					dismissable={false}
					style={{ width: 300, alignSelf: "center", transform: [{ translateY: animatedSlide.offset }] }}
				>
					<Dialog.Icon icon="alert-circle-outline" />
					<Dialog.Title style={{ textAlign: "center" }}>Reset profile?</Dialog.Title>
					<Dialog.Content>
						<Text>All your profile data will be lost forever. This does not includes your meal planning.</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={() => setConfirmResetProfile(false)}>No</Button>
						<Button
							onPress={() => {
								setConfirmResetProfile(false);
								updateProfile(null);
							}}
						>
							Yes
						</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</ScrollView>
	);
}

export default HealthGoalsEditScreen;
