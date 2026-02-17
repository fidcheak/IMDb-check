import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getImageUrl, getTitleDetails } from "../../services/api";

export default function TitleDetail() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    getTitleDetails(id, type || "movie").then(setDetails);
  }, [id]);

  if (!details)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    );

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={styles.imageHeader}>
        <Image
          source={{ uri: getImageUrl(details.poster_path, "original") }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{details.title || details.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {
              (details.release_date || details.first_air_date || "").split(
                "-",
              )[0]
            }
          </Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText}>
            {details.genres?.[0]?.name || "Кино"}
          </Text>
          <Text style={styles.ratingText}>
            ★ {details.vote_average?.toFixed(1)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Сюжет</Text>
        <Text style={styles.description}>
          {details.overview || "Описание на русском языке отсутствует."}
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
  imageHeader: { width: "100%", height: 450 },
  heroImage: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  content: {
    padding: 20,
    marginTop: -30,
    backgroundColor: "#121212",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  metaText: { color: "#888", fontSize: 14 },
  metaDivider: { color: "#444", marginHorizontal: 10 },
  ratingText: { color: "#F5C518", fontWeight: "bold", marginLeft: "auto" },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  description: { color: "#ccc", lineHeight: 22, fontSize: 15 },
});
