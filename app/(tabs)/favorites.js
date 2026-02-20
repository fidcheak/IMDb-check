import { FlatList, StyleSheet, Text, View } from "react-native";
import MovieCard from "../../components/MovieCard";
import { usePersistence } from "../../hooks/usePersistence";

export default function FavoritesScreen() {
  const { favorites } = usePersistence();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Избранное</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => `favorite-${item.id}-${index}`}
        renderItem={({ item }) => <MovieCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={
          <Text style={styles.infoText}>
            Здесь пока пусто. Добавьте фильмы, которые хотите посмотреть.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 15 },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoText: {
    color: "#444",
    textAlign: "center",
    marginTop: 100,
    fontSize: 14,
  },
});
