import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#F5C518" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Темный фон по умолчанию
  },
});

export default Loading;
