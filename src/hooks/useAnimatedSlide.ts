import { useEffect, useState } from "react";
import { Animated, useAnimatedValue, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";

export function useAnimatedSlide(
	origin: "bottom" | "top" | "right" | "left",
	visible: boolean
): { offset: Animated.Value; visible: boolean } {
	const theme = useTheme();
	const { height, width } = useWindowDimensions();
	const target =
		origin === "bottom"
			? height
			: origin === "top"
			? -height
			: origin === "right"
			? width
			: // origin === "left"
			  -width;
	const offset = useAnimatedValue(target);
	const [shouldBeVisible, setShouldBeVisible] = useState(visible);

	useEffect(() => {
		if (visible) {
			setShouldBeVisible(true);
			Animated.timing(offset, {
				toValue: 0,
				duration: 200 * theme.animation.scale,
				useNativeDriver: true
			}).start();
		} else {
			Animated.timing(offset, {
				toValue: target,
				duration: 200 * theme.animation.scale,
				useNativeDriver: true
			}).start(() => setShouldBeVisible(false));
		}
	}, [visible]);

	return { offset, visible: shouldBeVisible };
}
