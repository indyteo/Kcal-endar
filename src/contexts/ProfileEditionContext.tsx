import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { noop } from "../utils/functions";
import { ActivityLevel, Gender, HealthGoal, Profile } from "../utils/types";

export type PartialProfile = Partial<Omit<Profile, "height" | "weight">> & Pick<Profile, "height" | "weight">;
export interface ProfileEditionContextType extends PartialProfile {
	setBirthdate: (birthdate?: number) => void;
	setGender: (gender?: Gender) => void;
	setHeight: (height: number) => void;
	setWeight: (weight: number) => void;
	setActivityLevel: (activityLevel?: ActivityLevel) => void;
	setHealthGoal: (healthGoal?: HealthGoal) => void;
}

export const ProfileEditionContext = createContext<ProfileEditionContextType>({
	birthdate: undefined,
	gender: undefined,
	height: 0,
	weight: 0,
	activityLevel: undefined,
	healthGoal: undefined,
	setBirthdate: noop,
	setGender: noop,
	setHeight: noop,
	setWeight: noop,
	setActivityLevel: noop,
	setHealthGoal: noop
});

export const useProfileEditionContext = () => useContext(ProfileEditionContext);

export interface ProfileEditionContextProviderProps extends PropsWithChildren {
	profile: Profile | null;
}

export function ProfileEditionContextProvider({ children, profile }: ProfileEditionContextProviderProps) {
	const [birthdate, setBirthdate] = useState(profile?.birthdate);
	const [gender, setGender] = useState(profile?.gender);
	const [height, setHeight] = useState(profile?.height ?? 0);
	const [weight, setWeight] = useState(profile?.weight ?? 0);
	const [activityLevel, setActivityLevel] = useState(profile?.activityLevel);
	const [healthGoal, setHealthGoal] = useState(profile?.healthGoal);
	const context = useMemo(
		() => ({
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
		}),
		[birthdate, gender, height, weight, activityLevel, healthGoal]
	);
	return <ProfileEditionContext.Provider value={context} children={children} />;
}
