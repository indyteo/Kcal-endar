import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { Chip } from "react-native-paper";
import { IconSource } from "react-native-paper/src/components/Icon";

interface SelectableChipsPropsBase<T> {
	options: {
		label: string;
		value: T;
		icon?: IconSource;
	}[];
	style?: ViewStyle;
	chipStyle?: ViewStyle | ((props: { selected: boolean }) => ViewStyle | undefined);
}

export type SelectableChipsProps<T> = SelectableChipsPropsBase<T> &
	(
		| {
				multiple?: false;
				selected: T | undefined;
				onSelect: (selected: T) => void;
		  }
		| {
				multiple: true;
				selected: T[];
				onToggle: (option: T, selected: boolean) => void;
		  }
	);

export function SelectableChips<T>(props: SelectableChipsProps<T>) {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			nestedScrollEnabled
			contentContainerStyle={props.style}
		>
			{props.options.map((option, i) => {
				const isSelected = props.multiple ? props.selected.includes(option.value) : option.value === props.selected;
				return (
					<Chip
						key={i}
						mode={isSelected ? "flat" : "outlined"}
						icon={isSelected ? "check" : option.icon}
						selected={isSelected}
						onPress={() => {
							if (props.multiple) props.onToggle(option.value, !isSelected);
							else props.onSelect(option.value);
						}}
						style={typeof props.chipStyle === "function" ? props.chipStyle({ selected: isSelected }) : props.chipStyle}
					>
						{option.label}
					</Chip>
				);
			})}
		</ScrollView>
	);
}

export default SelectableChips;
