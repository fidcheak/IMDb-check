import { Image } from "expo-image"; // Better caching than standard Image
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Helper to format duration from seconds
const formatRuntime = (seconds) => {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
};

const MovieCard = ({ item }) => {
  const router = useRouter();

  // Destructure based on your specific JSON
  const { id, primaryTitle, startYear, primaryImage, rating, genres } = item;

  const imageUrl =
    primaryImage?.url || "https://via.placeholder.com/200x300?text=No+Image";
  const score = rating?.aggregateRating || "N/A";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/title/${id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.poster}
        contentFit="cover"
        transition={500}
      />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {primaryTitle}
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {score}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{startYear}</Text>
          {item.runtimeSeconds && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>
                {formatRuntime(item.runtimeSeconds)}
              </Text>
            </>
          )}
        </View>

        <View style={styles.genresContainer}>
          {genres?.slice(0, 3).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.plot} numberOfLines={2}>
          {item.plot || "No description available."}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    height: 180, // Fixed height for consistency
    borderWidth: 1,
    borderColor: "#333",
  },
  poster: {
    width: 120,
    height: "100%",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: "#F5C518", // IMDb Yellow
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metaText: {
    color: "#AAAAAA",
    fontSize: 12,
  },
  dot: {
    color: "#AAAAAA",
    marginHorizontal: 6,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: "#333",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  genreText: {
    color: "#DDD",
    fontSize: 10,
  },
  plot: {
    color: "#888",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default MovieCard;
