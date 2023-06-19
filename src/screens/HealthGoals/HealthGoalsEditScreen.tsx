import { StackScreenProps } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";

import { HealthGoalsStackParamList } from "./index";
import { HealthGoalsContext } from "../../../HealthGoalsContext";

interface FormData {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activityLevel: string;
	healthGoal: string;
}

function HealthGoalsEditScreen({ navigation }: StackScreenProps<HealthGoalsStackParamList, "Edit">) {
	const [age, setAge] = useState(0);
	const [gender, setGender] = useState("");
	const [height, setHeight] = useState(0);
	const [weight, setWeight] = useState(0);
	const [activityLevel, setActivityLevel] = useState("");
	const [healthGoal, setHealthGoal] = useState("");

	//const { setHealthGoalsData } = useContext(HealthGoalsContext);
	// fonction
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
		//setHealthGoalsData(formData);
		const bmr = calculateBMR();
	};

	// What we see
	return (
		<View>
			<Button onPress={() => navigation.navigate("Profile")}>Back to profile</Button>
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
			<SegmentedButtons
				buttons={[
					{ label: "Male", value: "male" },
					{ label: "Female", value: "female" }
				]}
				value={gender}
				onValueChange={setGender}
			/>

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
			<SegmentedButtons
				buttons={[
					{ label: "Sedentary", value: "sedentary" },
					{ label: "Light exercise", value: "light_exercise" },
					{ label: "Moderate exercise", value: "moderate_exercise" },
					{ label: "Heavy exercise", value: "heavy_exercise" },
					{ label: "Extra active", value: "extra_active" }
				]}
				value={activityLevel}
				onValueChange={setActivityLevel}
			/>

			<Text>Health Goal:</Text>
			<SegmentedButtons
				buttons={[
					{ label: "Lose", value: "weight_loss" },
					{ label: "Maintain", value: "weight_maintenance" },
					{ label: "Gain", value: "weight_gain" }
				]}
				value={healthGoal}
				onValueChange={setHealthGoal}
			/>

			<Button onPress={handleSubmit}> Submit </Button>
		</View>
	);
}

export default HealthGoalsEditScreen;
