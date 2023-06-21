import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { useMessagesContext } from "./MessagesContext";
import { loadProfile, saveProfile } from "../services/AppStorage";
import { noop } from "../utils/functions";
import { Profile } from "../utils/types";

export interface ProfileContextType {
	profile: Profile | null;
	updateProfile: (profile: Profile | null) => void;
}

export const ProfileContext = createContext<ProfileContextType>({ profile: null, updateProfile: noop });

export const useProfileContext = () => useContext(ProfileContext);

export function ProfileContextProvider({ children }: PropsWithChildren) {
	const { dispatchMessage } = useMessagesContext();
	const [profile, setProfile] = useState<Profile | null>();

	const updateProfile = useCallback((profile: Profile | null) => {
		setProfile(profile);
		dispatchMessage({ type: "save_begin" });
		saveProfile(profile)
			.then(() => dispatchMessage({ type: "save_end", message: "Profile updated" }))
			.catch(error => {
				console.error(error);
				dispatchMessage({ type: "save_end", message: "Unable to update profile!" });
			});
	}, []);

	useEffect(() => {
		loadProfile()
			.then(setProfile)
			.catch(error => {
				console.error(error);
				dispatchMessage({ type: "send_message", message: "Unable to load profile" });
				setProfile(null);
			});
	}, []);

	const context = useMemo(() => ({ profile, updateProfile }), [profile]);
	if (profile === undefined) {
		return (
			<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}
	return <ProfileContext.Provider value={context as ProfileContextType} children={children} />;
}
