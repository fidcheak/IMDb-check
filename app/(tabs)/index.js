import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import MovieCard from "../../components/MovieCard";
import { getTitles } from "../../services/api";

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMovies = async () => {
    if (loading) return;
    setLoading(true);
    const result = await getTitles(page);

    // Safety check for array response
    const newTitles = result.titles || [];

    setData((prev) => (page === 1 ? newTitles : [...prev, ...newTitles]));
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard item={item} />}
        contentContainerStyle={styles.listContent}
        onEndReached={() => setPage((prev) => prev + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#F5C518" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  listContent: {
    padding: 16,
  },
});
