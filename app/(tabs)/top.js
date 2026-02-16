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
  const [activeTab, setActiveTab] = useState("MOVIE");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { titles } = await getTopRated(activeTab);
      setData(titles);
      setLoading(false);
    };
    load();
  }, [activeTab]);

  return (
    <ScreenLayout>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "MOVIE" && styles.activeTab]}
          onPress={() => setActiveTab("MOVIE")}
        >
          <Text
            style={
              activeTab === "MOVIE" ? styles.activeTabText : styles.tabText
            }
          >
            Фильмы
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "TV" && styles.activeTab]}
          onPress={() => setActiveTab("TV")}
        >
          <Text
            style={activeTab === "TV" ? styles.activeTabText : styles.tabText}
          >
            Сериалы
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#F5C518"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${activeTab}-${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <MovieCard item={item} />
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 4,
  },
  tab: { flex: 1, padding: 10, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "#F5C518" },
  tabText: { color: "#888" },
  activeTabText: { color: "#000", fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rank: {
    color: "#F5C518",
    fontSize: 20,
    fontWeight: "bold",
    width: 40,
    textAlign: "center",
  },
});
