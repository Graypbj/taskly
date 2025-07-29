import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme } from "../theme";

type Props = {
  username: string;
  lastMessage: string;
  timestamp: string | Date;
  onPress: () => void;
};

export function ConversationListItem({
  username,
  lastMessage,
  timestamp,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGrey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colorBlack,
  },
  preview: {
    fontSize: 14,
    color: theme.colorGrey,
    marginTop: 4,
    maxWidth: 250,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colorGrey,
    marginLeft: 8,
  },
});
