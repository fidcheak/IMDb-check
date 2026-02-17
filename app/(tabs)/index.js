import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import { getTitles } from "../../services/api";

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadData = async (pageToLoad) => {
    if (pageToLoad === 1) setLoading(true);
    else setLoadingMore(true);

    const res = await getTitles(pageToLoad);

    if (res.titles) {
      setMovies((prev) =>
        pageToLoad === 1 ? res.titles : [...prev, ...res.titles]
      );
      setPage(res.nextPage);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && page) {
      loadData(page);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#F5C518" size="large" />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <MovieCard item={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.greeting}>Сегодня в тренде 👋</Text>
              <Text style={styles.title}>Популярное</Text>
            </View>
          )}
          ListFooterComponent={() =>
            loadingMore && (
              <ActivityIndicator color="#F5C518" style={{ margin: 20 }} />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  center: { flex: 1, justifyContent: "center" },
  listContent: { paddingBottom: 120, paddingHorizontal: 16 },
  header: { paddingTop: 60, marginBottom: 20 },
  greeting: { color: "#888", fontSize: 16 },
  title: { color: "#fff", fontSize: 32, fontWeight: "bold", marginTop: 4 },
});
