import { ActivityLevel, Gender, HealthGoal } from "../utils/types";

export function computeBMR(
	age: number,
	gender: Gender,
	height: number,
	weight: number,
	activityLevel: ActivityLevel,
	healthGoal: HealthGoal
): number {
	let bmr;
	if (gender === "male") {
		bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
	} else {
		// gender === "female"
		bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
	}
	switch (activityLevel) {
		case "sedentary":
			bmr *= 1.2;
			break;
		case "light_exercise":
			bmr *= 1.375;
			break;
		case "moderate_exercise":
			bmr *= 1.55;
			break;
		case "heavy_exercise":
			bmr *= 1.725;
			break;
		case "extra_active":
			bmr *= 1.9;
			break;
	}
	switch (healthGoal) {
		case "weight_loss":
			bmr *= 0.9; // -10%
			break;
		case "weight_maintenance":
			// bmr *= 1;
			break;
		case "weight_gain":
			bmr *= 1.1; // +10%
			break;
	}
	return Math.floor(bmr);
}
