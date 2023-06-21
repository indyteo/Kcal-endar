import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState
} from "react";

import { useMessagesContext } from "./MessagesContext";
import { loadPlanning, saveFoodItem, savePlanning } from "../services/AppStorage";
import { days, meals } from "../utils/constants";
import { getDayIndex, noop } from "../utils/functions";
import { Day, FoodItem, Meal, Planning } from "../utils/types";

export type PlanningAction =
	| {
			type: "planning_loaded";
			planning: Planning;
	  }
	| {
			type: "add_food";
			food: FoodItem;
			quantity: number;
			days: Day[];
			meals: Meal[];
			extra: boolean;
	  }
	| {
			type: "remove_food";
			foodId: string;
			day: Day;
			meal: Meal;
	  }
	| {
			type: "remove_food_from_all";
			foodId: string;
	  };

function planningReducer(state: Planning | null, action: PlanningAction): Planning | null {
	switch (action.type) {
		case "planning_loaded":
			return action.planning;
		case "add_food":
			state = { ...state! };
			for (const day of action.days) {
				state[day] = { ...state[day] };
				for (const meal of action.meals) {
					state[day][meal] = state[day][meal].concat({
						id: action.food.id,
						date: action.extra ? Date.now() : undefined,
						quantity: action.quantity
					});
				}
			}
			saveFoodItem(action.food).catch(console.error);
			break;
		case "remove_food":
			state = {
				...state!,
				[action.day]: {
					...state![action.day],
					[action.meal]: state![action.day][action.meal].filter(food => food.id !== action.foodId)
				}
			};
			break;
		case "remove_food_from_all":
			state = { ...state! };
			for (const day of days) {
				state[day] = { ...state[day] };
				for (const meal of meals) {
					state[day][meal] = state[day][meal].filter(food => food.id !== action.foodId);
				}
			}
			break;
		default:
			throw new Error("Unknown planning action to dispatch");
	}
	return state;
}

export interface PlanningContextType {
	planning: Planning | null;
	dispatchPlanning: (action: PlanningAction) => void;
}

export const PlanningContext = createContext<PlanningContextType>({ planning: null, dispatchPlanning: noop });

export const usePlanningContext = () => useContext(PlanningContext);

export function PlanningContextProvider({ children }: PropsWithChildren) {
	const { dispatchMessage } = useMessagesContext();
	const [planning, dispatchPlanningWithoutSaving] = useReducer(planningReducer, null);
	const [shouldSavePlanning, setShouldSavePlanning] = useState(false);

	const dispatchPlanning = useCallback(
		(action: PlanningAction) => {
			if (planning === null && action.type !== "planning_loaded") {
				dispatchMessage({ type: "send_message", message: "Planning not loaded yet..." });
				return;
			}
			dispatchPlanningWithoutSaving(action);
			setShouldSavePlanning(true);
		},
		[planning]
	);

	useEffect(() => {
		if (shouldSavePlanning) {
			setShouldSavePlanning(false);
			if (planning) {
				dispatchMessage({ type: "save_begin" });
				savePlanning(planning!)
					.then(() => dispatchMessage({ type: "save_end", message: "Planning updated" }))
					.catch(error => {
						console.error(error);
						dispatchMessage({ type: "save_end", message: "Unable to update planning!" });
					});
			}
		}
	}, [shouldSavePlanning]);

	useEffect(() => {
		loadPlanning()
			.then(verifyPlanning)
			.then(planning => dispatchPlanningWithoutSaving({ type: "planning_loaded", planning }))
			.catch(error => {
				console.error(error);
				dispatchMessage({ type: "send_message", message: "Unable to load planning" });
			});
	}, []);

	const context = useMemo(() => ({ planning, dispatchPlanning }), [planning]);
	return <PlanningContext.Provider value={context} children={children} />;
}

function createEmptyPlanning(): Planning {
	const planning = {} as Planning;
	for (const day of days) {
		planning[day] = {} as Planning[Day];
		for (const meal of meals) {
			planning[day][meal] = [];
		}
	}
	return planning;
}

function verifyPlanning(planning: Planning | null): Planning {
	if (planning === null) return createEmptyPlanning();
	for (const day of days) {
		for (const meal of meals) {
			planning[day][meal] = planning[day][meal].filter(food => !isExpired(food.date));
		}
	}
	return planning;
}

export function isExpired(date?: number): boolean {
	if (date === undefined) return false;
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return Date.now() - d.getTime() >= (7 - getDayIndex(d)) * 86_400_000; // 24h
}
