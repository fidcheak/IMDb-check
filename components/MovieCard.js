import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getImageUrl } from "../services/api";

export default function MovieCard({ item }) {
  const router = useRouter();

  const title = item.title || item.name || "Без названия";
  const date = item.release_date || item.first_air_date || "";
  const year = date.split("-")[0] || "Н/Д";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";
  const type = item.media_type || (item.title ? "movie" : "tv");

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/title/[id]",
          params: { id: item.id, type: type },
        })
      }
    >
      <Image
        source={{ uri: getImageUrl(item.poster_path, "w342") }}
        style={styles.poster}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.metaText}>
          {year} • {type === "movie" ? "Фильм" : "Сериал"}
        </Text>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={12} color="#000" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
  },
  info: { marginLeft: 15, flex: 1 },
  title: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  metaText: { color: "#888", fontSize: 13, marginTop: 4, marginBottom: 8 },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5C518",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
});
