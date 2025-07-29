import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getFromStorage(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function saveToStorage(key: string, data: object) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export async function saveThread(username: string, messages: any[]) {
  try {
    await AsyncStorage.setItem(`thread-${username}`, JSON.stringify(messages));
  } catch (err) {
    console.error("Error saving thread", err);
  }
}

export async function getThread(username: string): Promise<any[]> {
  try {
    const result = await AsyncStorage.getItem(`thread-${username}`);
    return result ? JSON.parse(result) : [];
  } catch (err) {
    console.error("Error retrieving thread", err);
    return [];
  }
}
