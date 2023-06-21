import { days } from "./constants";
import { Day } from "./types";

export const noop = () => {};

export function filterByLabel<T extends { label?: string }>(array?: T[], label?: string): T | undefined {
	return array?.filter(element => element.label === label)[0];
}

export function getAge(birthdate: Date): number {
	const now = new Date();
	const years = now.getFullYear() - birthdate.getFullYear();
	return now.getMonth() <= birthdate.getMonth() && now.getDate() < birthdate.getDate() ? years - 1 : years;
}

export function getDayIndex(date: Date): number {
	const currentDayIndex = date.getDay(); // 0 is Sunday
	return currentDayIndex === 0 ? 6 : currentDayIndex - 1;
}

export function getCurrentDay(): Day {
	return days[getDayIndex(new Date())];
}
