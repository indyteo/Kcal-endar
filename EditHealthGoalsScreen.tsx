import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
//import { StackNavigationProp } from '@react-navigation/stack';

import { HealthGoalsContext } from "./HealthGoalsContext";
import MyHealthGoals from "./MyHealthGoals";

interface FormData {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activityLevel: string;
	healthGoal: string;
}

function EditHealthGoalsScreen() {
	const navigation = useNavigation();
	const [age, setAge] = useState(0);
	const [gender, setGender] = useState("");
	const [height, setHeight] = useState(0);
	const [weight, setWeight] = useState(0);
	const [activityLevel, setActivityLevel] = useState("");
	const [healthGoal, setHealthGoal] = useState("");

	const { setHealthGoalsData } = useContext(HealthGoalsContext);
	// fonction
	const mainPage = () => {
		//navigation.navigate("");
		console.log("back main page");
	};
	const calculateBMR = (): number => {
		let bmr = 0;

		if (gender === "male") {
			bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
		} else if (gender === "female") {
			bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
		}

		return bmr;
	};
	const handleSubmit = () => {
		const formData: FormData = { age, gender, height, weight, activityLevel, healthGoal };
		setHealthGoalsData(formData);
		const bmr = calculateBMR();
	};

	// What we see
	return (
		<View>
			<Button onPress={mainPage}> Back at My profile </Button>
			<Text>Physical characteristics</Text>
			<Text>Age:</Text>
			<TextInput
				value={age.toString()}
				onChangeText={text => setAge(parseInt(text))}
				keyboardType="numeric"
				placeholder="Enter age"
				mode="outlined"
			/>

			<Text>Gender:</Text>
			<Picker selectedValue={gender} onValueChange={(itemValue: string) => setGender(itemValue)}>
				<Picker.Item label="Select gender" value="" />
				<Picker.Item label="Male" value="male" />
				<Picker.Item label="Female" value="female" />
			</Picker>

			<Text>Height:</Text>
			<TextInput
				value={height.toString()}
				onChangeText={text => setHeight(parseInt(text))}
				keyboardType="numeric"
				placeholder="Enter height in cm"
				mode="outlined"
			/>

			<Text>Weight:</Text>
			<TextInput
				value={weight.toString()}
				onChangeText={text => setWeight(parseInt(text))}
				keyboardType="numeric"
				placeholder="Enter weight in kg"
				mode="outlined"
			/>

			<Text>Activity Level:</Text>
			<Picker selectedValue={activityLevel} onValueChange={(itemValue: string) => setActivityLevel(itemValue)}>
				<Picker.Item label="Select activity level" value="" />
				<Picker.Item label="Sedentary" value="sedentary" />
				<Picker.Item label="Light exercise" value="light_exercise" />
				<Picker.Item label="Moderate exercise" value="moderate_exercise" />
				<Picker.Item label="Heavy exercise" value="heavy_exercise" />
				<Picker.Item label="Extra active" value="extra_active" />
			</Picker>

			<Text>Health Goal:</Text>
			<Picker selectedValue={healthGoal} onValueChange={(itemValue: string) => setHealthGoal(itemValue)}>
				<Picker.Item label="Select health goal" value="" />
				<Picker.Item label="Weight loss" value="weight_loss" />
				<Picker.Item label="Weight maintenance" value="weight_maintenance" />
				<Picker.Item label="Weight gain" value="weight_gain" />
			</Picker>

			<Button onPress={handleSubmit}> Submit </Button>
		</View>
	);
}

export default EditHealthGoalsScreen;
