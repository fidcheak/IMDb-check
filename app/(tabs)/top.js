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
import ScreenLayout from "../../components/ScreenLayout";
import { getTopRated } from "../../services/api";

export default function TopChartScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState("MOVIE");
  const [nextCursor, setNextCursor] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    setNextCursor(null); // Сбрасываем токен при смене вкладки

    const { titles, nextToken } = await getTopRated(activeTab, null);

    setData(titles);
    setNextCursor(nextToken);
    setLoading(false);
  };

  const loadMoreData = async () => {
    // Если токена нет, значит данных больше не будет
    if (loadingMore || !nextCursor) return;

    setLoadingMore(true);
    const { titles, nextToken } = await getTopRated(activeTab, nextCursor);

    if (titles.length > 0) {
      setData((prevData) => {
        // На всякий случай фильтруем дубли по ID (стандарт качества из Home)
        const existingIds = new Set(prevData.map((item) => item.id));
        const uniqueNew = titles.filter((item) => !existingIds.has(item.id));
        return [...prevData, ...uniqueNew];
      });
      setNextCursor(nextToken);
    } else {
      setNextCursor(null); // Если пришло пусто, значит финиш
    }
    setLoadingMore(false);
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 50 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#F5C518" />
      </View>
    );
  };

  return (
    <ScreenLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Рейтинги</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "MOVIE" && styles.activeTab]}
            onPress={() => activeTab !== "MOVIE" && setActiveTab("MOVIE")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "MOVIE" && styles.activeTabText,
              ]}
            >
              Фильмы
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "TV_SERIES" && styles.activeTab]}
            onPress={() =>
              activeTab !== "TV_SERIES" && setActiveTab("TV_SERIES")
            }
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "TV_SERIES" && styles.activeTabText,
              ]}
            >
              Сериалы
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#F5C518" />
        </View>
      ) : (
        <FlatList
          key={activeTab}
          data={data}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <View style={styles.rankBox}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <MovieCard item={item} />
              </View>
            </View>
          )}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, backgroundColor: "#121212" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#F5C518" },
  tabText: { color: "#888", fontWeight: "600" },
  activeTabText: { color: "#000", fontWeight: "bold" },
  list: { padding: 16 },
  row: { flexDirection: "row", marginBottom: 20 },
  rankBox: { width: 45, justifyContent: "center", alignItems: "center" },
  rankText: { color: "#F5C518", fontSize: 22, fontWeight: "bold" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  footerLoader: { paddingVertical: 20 },
});
