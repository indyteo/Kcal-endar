import React from "react";
import { IconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/src/components/Icon";

export interface IconToggleButtonProps {
	toggled: boolean;
	mode: "outlined" | "contained" | "contained-tonal" | "standard";
	iconOn: IconSource;
	iconOff: IconSource;
	onToggle: (enabling: boolean) => void;
	iconColorOn?: string;
	iconColorOff?: string;
	containerColorOn?: string;
	containerColorOff?: string;
	iconSize: number;
	containerSize?: number;
	disabled: boolean;
}

export function IconToggleButton({
	toggled,
	mode,
	iconOn,
	iconOff,
	onToggle,
	disabled,
	iconColorOn,
	iconColorOff,
	containerColorOn,
	containerColorOff,
	iconSize,
	containerSize
}: IconToggleButtonProps) {
	return (
		<IconButton
			mode={mode === "standard" ? undefined : mode}
			icon={toggled ? iconOn : iconOff}
			size={iconSize}
			onPress={() => onToggle(!toggled)}
			iconColor={toggled ? iconColorOn : iconColorOff}
			containerColor={toggled ? containerColorOn : containerColorOff}
			selected={toggled}
			disabled={disabled}
			style={
				containerSize
					? {
							width: containerSize,
							height: containerSize,
							borderRadius: containerSize / 2
					  }
					: undefined
			}
		/>
	);
}

IconToggleButton.defaultProps = {
	mode: "standard",
	iconSize: 24,
	disabled: false
};

export default IconToggleButton;
