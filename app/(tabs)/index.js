import { useEffect, useRef, useState } from "react";
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
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);

  const loadData = async (token = null) => {
    if (isFetching.current) return;
    isFetching.current = true;
    if (!token) setLoading(true);

    const res = await getTitles(token);
    setMovies((prev) => (token ? [...prev, ...res.titles] : res.titles));
    setNextToken(res.nextPageToken);

    setLoading(false);
    isFetching.current = false;
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoadMore = () => {
    if (nextToken && !isFetching.current) loadData(nextToken);
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
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.greeting}>Сегодня в тренде 👋</Text>
              <Text style={styles.title}>Популярное</Text>
            </View>
          )}
          ListFooterComponent={() =>
            nextToken && (
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
