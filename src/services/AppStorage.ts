import AsyncStorage from "@react-native-async-storage/async-storage";

import { Planning, Profile } from "../utils/types";

const profileStorageKey = "profile";
const planningStorageKey = "planning";

export function loadProfile(): Promise<Profile | null> {
	return AsyncStorage.getItem(profileStorageKey).then(value => (value === null ? null : JSON.parse(value)));
}

export function saveProfile(profile: Profile | null): Promise<void> {
	return profile === null
		? AsyncStorage.removeItem(profileStorageKey)
		: AsyncStorage.setItem(profileStorageKey, JSON.stringify(profile));
}

export function loadPlanning(): Promise<Planning | null> {
	return AsyncStorage.getItem(planningStorageKey).then(value => (value === null ? null : JSON.parse(value)));
}

export function savePlanning(planning: Planning): Promise<void> {
	return AsyncStorage.setItem(planningStorageKey, JSON.stringify(planning));
}
