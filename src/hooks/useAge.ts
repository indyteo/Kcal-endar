import { useMemo } from "react";

import { useProfileContext } from "../contexts/ProfileContext";
import { getAge } from "../utils/functions";

export function useAge() {
	const { profile } = useProfileContext();
	return useMemo(() => (profile === null ? 0 : getAge(new Date(profile?.birthdate))), [profile?.birthdate]);
}

export default useAge;
