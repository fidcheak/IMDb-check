import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Loading from "../../components/Loading"; // Используем новый компонент
import MovieCard from "../../components/MovieCard";
import ScreenLayout from "../../components/ScreenLayout"; // Используем обертку
import { getChartData } from "../../services/api";

export default function TopChartScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await getChartData();
      // API чартов иногда возвращает данные внутри поля 'item' или напрямую.
      // Здесь мы проверяем структуру. Если API возвращает массив объектов с полем 'rank',
      // нам может потребоваться извлечь данные фильма.

      // Предположим, что API возвращает список похожий на Titles,
      // либо мы мапим данные, если они отличаются.
      setData(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <ScreenLayout>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item, index }) => (
          <View>
            <Text style={styles.rank}>#{index + 1}</Text>
            <MovieCard item={item} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет данных для отображения</Text>
          </View>
        }
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  rank: {
    color: "#F5C518",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});
