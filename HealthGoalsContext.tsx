import React, { createContext, useState } from "react";

interface HealthGoals {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activityLevel: string;
	healthGoal: string;
}

interface HealthGoalsContextType {
	healthGoalsData: HealthGoals | null;
	setHealthGoalsData: React.Dispatch<React.SetStateAction<HealthGoals | null>>;
}

export const HealthGoalsContext = createContext<HealthGoalsContextType>({
	healthGoalsData: null,
	setHealthGoalsData: () => {}
});

export const HealthGoalsProvider: React.FC = ({ children }: React.PropsWithChildren<object>) => {
	const [healthGoalsData, setHealthGoalsData] = useState<HealthGoals | null>({
		age: 0,
		gender: "",
		height: 0,
		weight: 0,
		activityLevel: "",
		healthGoal: ""
	});

	const updateHealthGoalsData: HealthGoalsContextType["setHealthGoalsData"] = newData => {
		setHealthGoalsData(newData);
	};

	return (
		<HealthGoalsContext.Provider value={{ healthGoalsData, setHealthGoalsData: updateHealthGoalsData }}>
			{children}
		</HealthGoalsContext.Provider>
	);
};
