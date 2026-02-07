import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import ScreenLayout from "../../components/ScreenLayout";
import { searchTitles } from "../../services/api";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (query.trim().length === 0) return;

    Keyboard.dismiss();
    setLoading(true);
    setHasSearched(true);
    setResults([]); // Очищаем старые результаты

    try {
      const data = await searchTitles(query);
      setResults(data);
    } catch (e) {
      console.error("Search UI Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Фильмы, сериалы..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F5C518" />
          <Text style={styles.loadingText}>Ищем...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MovieCard item={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            hasSearched ? (
              <View style={styles.center}>
                <Text style={styles.emptyText}>
                  Ничего не найдено по запросу "{query}"
                </Text>
                <Text style={styles.hintText}>Попробуйте изменить запрос</Text>
              </View>
            ) : (
              <View style={styles.center}>
                <Ionicons name="film-outline" size={64} color="#333" />
                <Text style={styles.placeholderText}>
                  Введите название для поиска
                </Text>
              </View>
            )
          }
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: "100%",
  },
  list: { padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: { color: "#888", marginTop: 10 },
  emptyText: { color: "#F5C518", fontSize: 16, marginBottom: 5 },
  hintText: { color: "#555", fontSize: 14 },
  placeholderText: { color: "#555", marginTop: 10, fontSize: 16 },
});
