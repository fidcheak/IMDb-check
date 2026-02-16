import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MovieCard from "../../components/MovieCard";
import { getTopRated } from "../../services/api";

export default function TopChartScreen() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("MOVIE");
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const loadData = async (cursor = null) => {
    if (!cursor) setLoading(true);
    const res = await getTopRated(activeTab, cursor);
    setData((prev) => (cursor ? [...prev, ...res.titles] : res.titles));
    setNextCursor(res.nextToken);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Рейтинг</Text>
        <View style={styles.tabBar}>
          {["MOVIE", "TV"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.tab, activeTab === type && styles.activeTab]}
              onPress={() => {
                setData([]);
                setNextCursor(null);
                setActiveTab(type);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === type && styles.activeTabText,
                ]}
              >
                {type === "MOVIE" ? "Фильмы" : "Сериалы"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#F5C518" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `top-${item.id}-${index}`}
          renderItem={({ item }) => <MovieCard item={item} />}
          onEndReached={() => nextCursor && loadData(nextCursor)}
          onEndReachedThreshold={0.4}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          ListFooterComponent={() =>
            nextCursor && (
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
  header: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 15 },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
  activeTab: { backgroundColor: "#F5C518" },
  tabText: { color: "#888", fontWeight: "700" },
  activeTabText: { color: "#000" },
});
