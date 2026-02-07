import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";

const PosterCard = ({ item }) => {
  const router = useRouter();
  const imageUrl =
    item.primaryImage?.url ||
    "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/title/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.poster}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.primaryTitle}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>
            ★ {item.rating?.aggregateRating?.toFixed(1) || "N/A"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 16,
    backgroundColor: "transparent",
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    backgroundColor: "#222", // Placeholder color while image loads
  },
  info: {
    paddingTop: 8,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
    height: 40, // Reserve space for two lines
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PosterCard;
