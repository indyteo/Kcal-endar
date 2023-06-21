import { Snackbar } from "react-native-paper";

import { useMessagesContext } from "../contexts/MessagesContext";

export function Messages() {
	const { messages, dispatchMessage } = useMessagesContext();
	const clearMessage = () => dispatchMessage({ type: "clear_message" });
	return (
		<Snackbar visible={messages.message !== undefined} onDismiss={clearMessage} onIconPress={clearMessage}>
			{messages.message}
		</Snackbar>
	);
}

export default Messages;
