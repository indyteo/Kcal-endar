import React, { useEffect, useState } from "react";
import { Image, Modal as RNModal, ScrollView, View, ViewStyle } from "react-native";
import {
	Appbar,
	Button,
	Dialog,
	HelperText,
	Modal,
	Portal,
	SegmentedButtons,
	Text,
	TextInput,
	useTheme
} from "react-native-paper";

import SelectableChips from "./SelectableChips";
import { usePlanningContext } from "../contexts/PlanningContext";
import { useAnimatedSlide } from "../hooks/useAnimatedSlide";
import { days as allDays, mealIcons, meals as allMeals } from "../utils/constants";
import { Day, FoodItem, Meal } from "../utils/types";

export interface AddToMealPlanProps {
	item: FoodItem;
	defaultDay?: Day;
	defaultMeal?: Meal;
	controlledVisibility?: boolean;
	onClose?: () => void;
	style?: ViewStyle;
}

export function AddToMealPlan({
	item,
	defaultDay,
	defaultMeal,
	controlledVisibility,
	onClose,
	style
}: AddToMealPlanProps) {
	const theme = useTheme();
	const { dispatchPlanning } = usePlanningContext();
	const [visible, _setVisible] = useState(!!controlledVisibility);
	const [confirmCancel, setConfirmCancel] = useState(false);
	const setVisible = controlledVisibility === undefined ? _setVisible : () => onClose?.();
	useEffect(() => {
		if (controlledVisibility !== undefined) {
			_setVisible(controlledVisibility);
			setQuantity(1);
			setDays(defaultDay ? [defaultDay] : []);
			setMeals(defaultMeal ? [defaultMeal] : []);
			setExtra(false);
		}
	}, [controlledVisibility]);

	const [quantity, setQuantity] = useState(1);
	const [days, setDays] = useState<Day[]>(defaultDay ? [defaultDay] : []);
	const [meals, setMeals] = useState<Meal[]>(defaultMeal ? [defaultMeal] : []);
	const [extra, setExtra] = useState(false);

	const animatedSlide = useAnimatedSlide("bottom", visible);
	const animatedSlideConfirm = useAnimatedSlide("bottom", confirmCancel);

	const add = () => {
		dispatchPlanning({ type: "add_food", food: item, quantity, days, meals, extra });
		setVisible(false);
	};
	const close = () => setConfirmCancel(true);

	return (
		<>
			{controlledVisibility === undefined && (
				<Button mode="contained" onPress={() => setVisible(true)} style={style}>
					Add to meal plan
				</Button>
			)}
			<Portal>
				<Modal
					visible={animatedSlide.visible}
					onDismiss={close}
					dismissable={false}
					contentContainerStyle={{ transform: [{ translateY: animatedSlide.offset }], opacity: 1 }}
				>
					<Appbar.Header elevated>
						<Appbar.Action icon="close" onPress={close} />
						<Appbar.Content title="Add to meal plan" />
						<Button mode="text" onPress={add} disabled={days.length === 0 || meals.length === 0}>
							Add
						</Button>
					</Appbar.Header>
					<ScrollView
						contentContainerStyle={{
							height: "100%",
							backgroundColor: theme.colors.background,
							paddingVertical: 25,
							gap: 25
						}}
					>
						<View style={{ paddingHorizontal: 20, gap: 25 }}>
							<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
								<Image source={{ uri: item.image, width: 128, height: 128 }} borderRadius={4 * theme.roundness} />
								<View style={{ gap: 10 }}>
									<Text variant="headlineLarge">{item.label}</Text>
									<Text variant="headlineSmall" style={{ color: theme.colors.onSurfaceVariant }}>
										{item.kcal} kcal per unit ({item.weight}g)
									</Text>
								</View>
							</View>
							<Text variant="titleMedium">Select quantity (in units of {item.weight}g)</Text>
							<View>
								<TextInput
									label="Quantity"
									value={quantity.toString()}
									onChangeText={text => setQuantity(parseInt(text, 10))}
									mode="outlined"
									left={
										<TextInput.Icon
											icon="minus"
											onPress={() => setQuantity(q => q - 1)}
											disabled={quantity === 1}
											forceTextInputFocus={false}
										/>
									}
									right={
										<TextInput.Icon icon="plus" onPress={() => setQuantity(q => q + 1)} forceTextInputFocus={false} />
									}
									keyboardType="numeric"
								/>
								<HelperText type="info">
									{item.kcal} kcal per unit, total {item.kcal * quantity} kcal
								</HelperText>
							</View>
							<Text variant="titleMedium">Select days of week</Text>
							<Text>On which days are you planning to eat this food? You can select multiple days.</Text>
						</View>
						<View>
							<SelectableChips
								options={allDays.map(day => ({ label: day, value: day }))}
								selected={days}
								multiple
								onToggle={(day, selected) => {
									if (selected) setDays(days.concat(day));
									else setDays(days.filter(d => d !== day));
								}}
								style={{ paddingHorizontal: 20, gap: 10 }}
							/>
						</View>
						<View style={{ paddingHorizontal: 20, gap: 25 }}>
							<Text variant="titleMedium">Select meals</Text>
							<Text>During which meals are you planning to eat this food? You can select multiple meals.</Text>
						</View>
						<View>
							<SelectableChips
								options={allMeals.map(meal => ({ label: meal, value: meal, icon: mealIcons[meal] }))}
								selected={meals}
								multiple
								onToggle={(meal, selected) => {
									if (selected) setMeals(meals.concat(meal));
									else setMeals(meals.filter(m => m !== meal));
								}}
								style={{ paddingHorizontal: 20, gap: 10 }}
							/>
						</View>
						<View style={{ paddingHorizontal: 20, gap: 25 }}>
							<Text variant="titleMedium">Recurrence</Text>
							<Text>
								Do you want this food to be permanently added to your planning (every week) or only this time?
							</Text>
							<SegmentedButtons
								buttons={[
									{ label: "This time only", value: "extra", icon: "clock-outline", showSelectedCheck: true },
									{ label: "Every week", value: "permanent", icon: "repeat", showSelectedCheck: true }
								]}
								value={extra ? "extra" : "permanent"}
								onValueChange={value => setExtra(value === "extra")}
							/>
						</View>
					</ScrollView>
					<RNModal visible={animatedSlideConfirm.visible} transparent>
						<Dialog
							visible={animatedSlideConfirm.visible}
							dismissable={false}
							style={{ width: 300, alignSelf: "center", transform: [{ translateY: animatedSlideConfirm.offset }] }}
						>
							<Dialog.Icon icon="alert-circle-outline" />
							<Dialog.Title style={{ textAlign: "center" }}>Cancel action?</Dialog.Title>
							<Dialog.Content>
								<Text>This food won’t be added to your meal plan if you cancel without saving.</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button onPress={() => setConfirmCancel(false)}>No</Button>
								<Button
									onPress={() => {
										setConfirmCancel(false);
										setVisible(false);
									}}
								>
									Yes
								</Button>
							</Dialog.Actions>
						</Dialog>
					</RNModal>
				</Modal>
			</Portal>
		</>
	);
}

export default AddToMealPlan;
