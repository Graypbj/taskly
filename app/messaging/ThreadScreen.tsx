import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TextInput,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MessageBubble } from "../../components/MessageBubble";
import { useEffect, useState } from "react";
import { getThread, saveThread } from "../../utils/storage";
import { sendMessage } from "../../utils/messaging";
import { WebSocketManager } from "../../utils/websocketManager";
import { WEBSOCKET_URL } from "../../config";

type Message = {
  id: string;
  body: string;
  timestamp: string;
  isCurrentUser: boolean;
};

export default function ThreadScreen() {
  const { username, messages: initialMessages } = useLocalSearchParams<{
    username: string;
    messages: string; // comes in as JSON string
  }>();

  const [messages, setMessages] = useState<Message[]>(
    JSON.parse(initialMessages || "[]")
  );
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const ws = WebSocketManager.getInstance();
    ws.connect(WEBSOCKET_URL, async (incoming) => {
      const { from, body, timestamp } = incoming;
      if (from === username) {
        const message = {
          id: Date.now().toString(),
          body,
          timestamp,
          isCurrentUser: false,
        };
        const thread = await getThread(from);
        const updated = [...thread, message];
        await saveThread(from, updated);
        setMessages(updated);
      }
    });

    return () => ws.disconnect();
  }, [username]);

  const handleSend = async () => {
    if (newMessage.trim().length === 0) return;
    await sendMessage(username, newMessage);
    const updatedMessages = await getThread(username);
    setMessages(updatedMessages);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            body={item.body}
            timestamp={item.timestamp}
            isCurrentUser={item.isCurrentUser}
          />
        )}
        contentContainerStyle={styles.thread}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  thread: {
    padding: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
