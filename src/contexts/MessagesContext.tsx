import React, { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";

import { noop } from "../utils/functions";

export type Messages = {
	saving: boolean;
	message?: string;
};

export type MessagesAction =
	| {
			type: "save_begin";
	  }
	| {
			type: "save_end";
			message: string;
	  }
	| {
			type: "send_message";
			message: string;
	  }
	| {
			type: "clear_message";
	  };

function messagesReducer(state: Messages, action: MessagesAction): Messages {
	switch (action.type) {
		case "save_begin":
			return { ...state, saving: true };
		case "save_end":
			return { ...state, saving: false, message: action.message };
		case "send_message":
			return { ...state, message: action.message };
		case "clear_message":
			return { ...state, message: undefined };
	}
	throw new Error("Unknown message action to dispatch");
}

export interface MessagesContextType {
	messages: Messages;
	dispatchMessage: (action: MessagesAction) => void;
}

export const MessagesContext = createContext<MessagesContextType>({
	messages: { saving: false },
	dispatchMessage: noop
});

export const useMessagesContext = () => useContext(MessagesContext);

export function MessagesContextProvider({ children }: PropsWithChildren) {
	const [messages, dispatchMessage] = useReducer(messagesReducer, { saving: false });
	const context = useMemo(() => ({ messages, dispatchMessage }), [messages]);
	return <MessagesContext.Provider value={context} children={children} />;
}
