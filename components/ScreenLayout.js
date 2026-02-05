import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenLayout = ({ children, style }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
});

export default ScreenLayout;
