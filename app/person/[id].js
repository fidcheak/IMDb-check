
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MovieCard from "../../components/MovieCard";
import ScreenLayout from "../../components/ScreenLayout";
import { getImageUrl, getPersonDetails } from "../../services/api";

const BIO_TRUNCATE_LENGTH = 4;

function ReadMoreBio({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setIsExpanded((p) => !p);

  const { isTruncated, truncated, full } = useMemo(() => {
    const lines = (text || "").split(/\r?\n/);
    return {
      isTruncated: lines.length > BIO_TRUNCATE_LENGTH,
      truncated: lines.slice(0, BIO_TRUNCATE_LENGTH).join("\n"),
      full: text,
    };
  }, [text]);

  if (!text)
    return (
      <Text style={styles.bio}>Биография на русском языке отсутствует.</Text>
    );

  return (
    <View>
      <Text style={styles.bio}>{isExpanded ? full : truncated}</Text>
      {isTruncated && (
        <TouchableOpacity onPress={toggle}>
          <Text style={styles.readMore}>
            {isExpanded ? "Свернуть" : "Читать полностью"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function PersonDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getPersonDetails(id)
      .then(setDetails)
      .finally(() => setIsLoading(false));
  }, [id]);

  const filmography = useMemo(() => {
    if (!details?.combined_credits?.cast) return [];
    // Сортируем по популярности, затем убираем дубликаты
    return [...details.combined_credits.cast]
      .sort((a, b) => b.popularity - a.popularity)
      .filter(
        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i && v.poster_path,
      )
      .slice(0, 20); // Оставляем только топ-20
  }, [details]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F5C518" size="large" />
      </View>
    );
  }

  if (!details) {
    return (
      <ScreenLayout>
        <View style={styles.center}>
          <Text style={styles.title}>Информация недоступна</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.readMore}>Назад</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: getImageUrl(details.profile_path, "h632") }}
          style={styles.profileImage}
          contentFit="cover"
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{details.name}</Text>
        <Text style={styles.meta}>
          {details.birthday || "Дата не указана"} •{" "}
          {details.place_of_birth || "Место не указано"}
        </Text>

        {details.biography ? (
          <>
            <Text style={styles.sectionTitle}>Биография</Text>
            <ReadMoreBio text={details.biography} />
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Известен(-на) по проектам</Text>
      </View>
      <FlatList
        data={filmography}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 20 }}>
            <MovieCard item={item} />
          </View>
        )}
        keyExtractor={(item) => `\${item.id}-\${item.credit_id}`}
        ListEmptyComponent={() => (
          <Text style={styles.bio}>Фильмография пуста.</Text>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
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
  header: { width: "100%", height: 350, position: "relative" },
  profileImage: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
  content: { padding: 20, paddingBottom: 10 },
  name: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  meta: { color: "#aaa", fontSize: 14, marginTop: 5 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  bio: { color: "#ccc", lineHeight: 22, fontSize: 15 },
  readMore: {
    color: "#F5C518",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 15,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
