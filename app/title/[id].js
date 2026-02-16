import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getImageUrl, getTitleDetails } from "../../services/api";

export default function TitleDetail() {
  const { id, type = "movie" } = useLocalSearchParams(); // type передаем из MovieCard
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const data = await getTitleDetails(id, type);
      setDetails(data);
      setLoading(false);
    };
    loadDetails();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F5C518" />
      </View>
    );
  if (!details)
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Ошибка загрузки</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: getImageUrl(
            details.backdrop_path || details.poster_path,
            "original",
          ),
        }}
        style={styles.heroImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{details.title || details.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {
              (details.release_date || details.first_air_date || "").split(
                "-",
              )[0]
            }
          </Text>
          <Text style={styles.meta}>
            {" "}
            • {details.runtime || details.episode_run_time?.[0] || "N/A"} мин
          </Text>
          <Text style={styles.rating}>
            ★ {details.vote_average?.toFixed(1)}/10
          </Text>
        </View>

        <View style={styles.genres}>
          {details.genres?.map((g) => (
            <View key={g.id} style={styles.pill}>
              <Text style={styles.pillText}>{g.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.body}>
          {details.overview || "Описание отсутствует."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  heroImage: { width: "100%", height: 300, backgroundColor: "#222" },
  content: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  meta: { color: "#aaa", fontSize: 16, marginRight: 10 },
  rating: {
    color: "#F5C518",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  genres: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  pill: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: { color: "#ddd", fontSize: 12 },
  sectionTitle: {
    color: "#F5C518",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  body: { color: "#ddd", fontSize: 16, lineHeight: 24 },
  text: { color: "#fff" },
});
