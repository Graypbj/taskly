import { getThread, saveThread } from "./storage";
import { WebSocketManager } from "./websocketManager";

const sendMessage = async (username: string, body: string) => {
  const message = {
    id: Date.now().toString(),
    body,
    timestamp: new Date().toISOString(),
    isCurrentUser: true,
    to: username,
  };

  WebSocketManager.getInstance().send(message);

  // Save to local storage
  const prev = await getThread(username);
  const updated = [...prev, message];
  await saveThread(username, updated);
};
