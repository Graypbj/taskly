import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ConversationListItem } from "../../components/ConversationListItem";
import { WebSocketManager } from "../../utils/websocketManager";
import { useEffect, useState } from "react";
import { getAllThreads, getThread, saveThread } from "../../utils/storage";
import { WEBSOCKET_URL } from "../../config";

export default function MessagingScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadConversations = async () => {
      const threads = await getAllThreads();
      setConversations(threads);
    };
    loadConversations();
  }, []);

  useEffect(() => {
    const ws = WebSocketManager.getInstance();

    ws.connect(WEBSOCKET_URL, async (incoming) => {
      console.log("Received:", incoming);
      // TODO: Save to storage and update UI

      const { from, body, timestamp }_ = incoming;

      const message = {
        id: Date.now().toString(),
        body,
        timestamp,
        isCurrentUser: false,
      };

      const thread = await getThread(from);
      const updated = [...thread, message];
      await saveThread(from, updated);

      // Update the conversations state
      const newConversations = await getAllThreads();
      setConversations(newConversations);
    });

    return () => ws.disconnect();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => {
          const last = item.messages[item.messages.length - 1];
          return (
            <ConversationListItem
              username={item.username}
              lastMessage={last.body}
              timestamp={last.timestamp}
              onPress={() =>
                router.push({
                  pathname: "/messaging/ThreadScreen",
                  params: {
                    username: item.username,
                    messages: JSON.stringify(item.messages),
                  },
                })
              }
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
