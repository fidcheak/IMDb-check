import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import ScreenLayout from "../../components/ScreenLayout";
import { getTopRated } from "../../services/api"; // Импортируем новую функцию

export default function TopChartScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTop();
  }, []);

  const loadTop = async () => {
    setLoading(true);
    const results = await getTopRated();
    setData(results);
    setLoading(false);
  };

  return (
    <ScreenLayout>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Популярное</Text>
        <Text style={styles.headerSubtitle}>Топ фильмов по версии IMDb</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F5C518" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.itemWrapper}>
              {/* Ранг (номер по порядку) */}
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>

              {/* Карточка */}
              <View style={{ flex: 1 }}>
                <MovieCard item={item} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Не удалось загрузить топ</Text>
            </View>
          }
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5C518",
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  list: { padding: 16 },
  itemWrapper: {
    flexDirection: "row",
    marginBottom: 16,
  },
  rankContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  rankText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { color: "#888" },
});
