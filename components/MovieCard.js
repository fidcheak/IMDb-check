import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getImageUrl } from "../services/api";

export default function MovieCard({ item }) {
  const router = useRouter();

  // 1. Логика определения названия (фильм vs сериал)
  const title = item.title || item.name;

  // 2. Логика определения года
  const rawDate = item.release_date || item.first_air_date;
  const year = rawDate ? rawDate.split("-")[0] : "N/A";

  // 3. Форматирование рейтинга (округляем до 1 знака)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "0.0";

  // 4. Определение типа медиа для навигации
  // Если API не вернул media_type (например, в поиске), гадаем по наличию title
  const mediaType = item.media_type || (item.title ? "movie" : "tv");

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/title/[id]",
          params: { id: item.id, type: mediaType },
        })
      }
    >
      <Image
        source={{ uri: getImageUrl(item.poster_path, "w342") }}
        style={styles.poster}
        contentFit="cover"
        transition={500}
      />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.year}>{year}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F5C518" />
            <Text style={styles.rating}>{rating}</Text>
          </View>
        </View>

        <Text style={styles.overview} numberOfLines={3}>
          {item.overview || "Описание отсутствует."}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    height: 150,
    elevation: 3, // Тень для Android
    shadowColor: "#000", // Тень для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: "100%",
    backgroundColor: "#333",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  year: {
    color: "#aaa",
    fontSize: 14,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  overview: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
  },
});
