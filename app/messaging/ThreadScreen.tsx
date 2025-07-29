import { View, StyleSheet, FlatList, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MessageBubble } from "../../components/MessageBubble";

type Message = {
  id: string;
  body: string;
  timestamp: string;
  isCurrentUser: boolean;
};

export default function ThreadScreen() {
  const { username, messages } = useLocalSearchParams<{
    username: string;
    messages: string; // comes in as JSON string
  }>();

  const parsedMessages: Message[] = JSON.parse(messages || "[]");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{username}</Text>
      <FlatList
        data={parsedMessages}
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
});
