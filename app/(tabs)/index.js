import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View
} from "react-native";
import MovieCard from "../../components/MovieCard";
import { getTitles } from "../../services/api";

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Флаг для предотвращения одновременных запросов
  const isFetching = useRef(false);

  const loadMovies = async (token = null, isRefresh = false) => {
    if (isFetching.current) return;

    isFetching.current = true;
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    const result = await getTitles(token);

    if (result.titles && result.titles.length > 0) {
      setData((prevData) => {
        // Если это обновление (Pull-to-refresh), заменяем данные полностью
        if (isRefresh) return result.titles;

        // Если подгрузка — фильтруем по ID, чтобы не было дублей
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNew = result.titles.filter(
          (item) => !existingIds.has(item.id),
        );

        return [...prevData, ...uniqueNew];
      });

      // Сохраняем НОВЫЙ токен
      setNextPageToken(result.nextPageToken);
      console.log("--- Токен обновлен на:", result.nextPageToken);
    } else {
      // Если API ничего не вернуло, зануляем токен, чтобы не пытаться снова
      setNextPageToken(null);
    }

    setIsLoading(false);
    setIsRefreshing(false);
    isFetching.current = false;
  };

  useEffect(() => {
    loadMovies(null); // Загрузка самой первой страницы
  }, []);

  const handleLoadMore = () => {
    // ВАЖНО: запрашиваем только если есть токен и он НЕ совпадает с предыдущим
    if (nextPageToken && !isLoading && !isFetching.current) {
      loadMovies(nextPageToken);
    }
  };

  const handleRefresh = () => {
    setNextPageToken(null);
    loadMovies(null, true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard item={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2} // Срабатывает ближе к концу списка
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isLoading && nextPageToken ? (
            <ActivityIndicator
              size="large"
              color="#F5C518"
              style={{ margin: 20 }}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
});
