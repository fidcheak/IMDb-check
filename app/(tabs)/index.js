import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import MovieCard from "../../components/MovieCard";
import { getTitles } from "../../services/api";

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetching = useRef(false);

  const loadMovies = async (page = 1, isRefresh = false) => {
    if (isFetching.current) return;
    isFetching.current = true;

    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    const result = await getTitles(page);

    if (result.titles?.length > 0) {
      setData((prev) =>
        isRefresh ? result.titles : [...prev, ...result.titles],
      );
      setNextPage(result.nextPageToken);
    }

    setIsLoading(false);
    setIsRefreshing(false);
    isFetching.current = false;
  };

  useEffect(() => {
    loadMovies(1);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <MovieCard item={item} />}
        onEndReached={() => nextPage && loadMovies(nextPage)}
        onEndReachedThreshold={0.3}
        refreshing={isRefreshing}
        onRefresh={() => loadMovies(1, true)}
        ListFooterComponent={
          isLoading && (
            <ActivityIndicator
              size="large"
              color="#F5C518"
              style={{ margin: 20 }}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
});
