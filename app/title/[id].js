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
import { getTitleDetails } from "../../services/api";

export default function TitleDetail() {
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      const data = await getTitleDetails(id);
      setDetails(data);
      setLoading(false);
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F5C518" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Error loading details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: details.primaryImage?.url }}
        style={styles.heroImage}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{details.primaryTitle}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{details.startYear}</Text>
          <Text style={styles.meta}>
            {" "}
            •{" "}
            {details.runtimeSeconds
              ? Math.floor(details.runtimeSeconds / 60) + " min"
              : "N/A"}
          </Text>
          <Text style={styles.rating}>
            ★ {details.rating?.aggregateRating}/10
          </Text>
        </View>

        <View style={styles.genres}>
          {details.genres?.map((g) => (
            <View key={g} style={styles.pill}>
              <Text style={styles.pillText}>{g}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Plot</Text>
        <Text style={styles.body}>{details.plot}</Text>

        <Text style={styles.sectionTitle}>Type</Text>
        <Text style={styles.body}>{details.type}</Text>
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
  heroImage: { width: "100%", height: 400 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  pillText: { color: "#ddd" },
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
