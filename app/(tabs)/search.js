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

  const handleSearch = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    const data = await searchTitles(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Поиск..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F5C518" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard item={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Начните поиск...</Text>
          }
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: "#121212" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, color: "#fff", marginLeft: 10 },
  center: { flex: 1, justifyContent: "center", marginTop: 50 },
  empty: { color: "#555", textAlign: "center", marginTop: 40 },
});
