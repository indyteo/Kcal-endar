import { useMemo } from "react";

import useAge from "./useAge";
import { useProfileContext } from "../contexts/ProfileContext";
import { computeBMR } from "../services/Calories";

export function useBMR() {
	const { profile } = useProfileContext();
	const age = useAge();
	return useMemo(
		() =>
			profile === null
				? 0
				: computeBMR(
						age,
						profile?.gender,
						profile?.height,
						profile?.weight,
						profile?.activityLevel,
						profile?.healthGoal
				  ),
		[profile, age]
	);
}

export default useBMR;
