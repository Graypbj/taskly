import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ConversationListItem } from "../../components/ConversationListItem";
import { WebSocketManager } from "../../utils/websocketManager";
import { useEffect } from "react";
import { getThread, saveThread } from "../../utils/storage";

export default function MessagingScreen() {
  useEffect(() => {
    const ws = WebSocketManager.getInstance();

    ws.connect("ws://your-server-url", async (incoming) => {
      console.log("Received:", incoming);
      // TODO: Save to storage and update UI

      const { from, body, timestamp } = incoming;

      const message = {
        id: Date.now().toString(),
        body,
        timestamp,
        isCurrentUser: false,
      };

      const thread = await getThread(from);
      const updated = [...thread, message];
      await saveThread(from, updated);
    });

    return () => ws.disconnect();
  }, []);

  const router = useRouter();

  const conversations = [
    {
      username: "Timmy",
      messages: [
        { id: "1", body: "Hello", timestamp: new Date(), isCurrentUser: true },
        {
          id: "2",
          body: "How are you?",
          timestamp: new Date(),
          isCurrentUser: true,
        },
        {
          id: "3",
          body: "I'm good!",
          timestamp: new Date(),
          isCurrentUser: false,
        },
      ],
    },
    {
      username: "Sarah",
      messages: [
        {
          id: "1",
          body: "Hey! Did you finish it?",
          timestamp: new Date(),
          isCurrentUser: false,
        },
        {
          id: "2",
          body: "Not yet. Working on it.",
          timestamp: new Date(),
          isCurrentUser: true,
        },
      ],
    },
  ];

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
