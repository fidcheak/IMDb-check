import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/theme";

const LogoHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>
        IMDb <Text style={styles.logoTextHighlight}>Check</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  logoTextHighlight: {
    color: Colors.dark.tint, // Gold color for highlight
  },
});

export default LogoHeader;
