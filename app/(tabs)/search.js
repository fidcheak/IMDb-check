import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import { usePersistence } from "../../hooks/usePersistence";
import { searchTitles } from "../../services/api";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { history, clearHistory } = usePersistence();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      const res = await searchTitles(text);
      setResults(res.titles || res || []);
    } else {
      setResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Поиск</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#F5C518"
            style={{ marginRight: 12 }}
          />
          <TextInput
            placeholder="Название фильма..."
            placeholderTextColor="#666"
            style={styles.input}
            onChangeText={handleSearch}
            value={query}
          />
        </View>
      </View>

      {query.length > 2 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `search-${item.id}-${index}`}
          renderItem={({ item }) => <MovieCard item={item} />}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
          ListEmptyComponent={
            <Text style={styles.infoText}>Поиск по базе данных...</Text>
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Вы недавно смотрели</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Очистить историю</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item, index) => `history-${item.id}-${index}`}
            renderItem={({ item }) => <MovieCard item={item} />}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 120,
            }}
            ListEmptyComponent={
              <Text style={styles.infoText}>
                Здесь пока пусто. Посетите страницу фильма или сериала, и она
                появится здесь.
              </Text>
            }
          />
        </View>
      )}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 56,
  },
  input: { flex: 1, color: "#fff", fontSize: 16, fontWeight: "500" },
  infoText: {
    color: "#444",
    textAlign: "center",
    marginTop: 100,
    fontSize: 14,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    color: "#F5C518",
    fontSize: 14,
  },
});
