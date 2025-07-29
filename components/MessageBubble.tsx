import { Text, View, StyleSheet } from "react-native";
import { theme } from "../theme";

type Props = {
  body: string;
  timestamp: string | Date;
  isCurrentUser: boolean;
};

export function MessageBubble({ body, timestamp, isCurrentUser }: Props) {
  return (
    <View
      style={[
        styles.bubble,
        isCurrentUser ? styles.myBubble : styles.theirBubble,
      ]}
    >
      <Text style={styles.bodyText}>{body}</Text>
      <Text style={styles.timestamp}>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  myBubble: {
    backgroundColor: theme.colorCerulean,
    alignSelf: "flex-end",
  },
  theirBubble: {
    backgroundColor: theme.colorLightGrey,
    alignSelf: "flex-start",
  },
  bodyText: {
    fontSize: 16,
    color: theme.colorBlack,
  },
  timestamp: {
    fontSize: 10,
    color: theme.colorGrey,
    marginTop: 4,
    textAlign: "right",
  },
});
