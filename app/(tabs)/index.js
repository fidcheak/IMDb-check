import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import MovieCarousel from "../../components/MovieCarousel";
import { getTitles, getTopRated } from "../../services/api";
import { Colors } from "../../constants/theme";

export default function HomeScreen() {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMovies = async () => {
    // Fetch in parallel
    const [popularResult, topRatedResult] = await Promise.all([
      getTitles(),
      getTopRated(),
    ]);

    if (popularResult.titles) {
      setPopular(popularResult.titles);
    }
    if (topRatedResult.titles) {
      setTopRated(topRatedResult.titles);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadMovies();
    setIsRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.dark.tint}
        />
      }
    >
      <MovieCarousel title="Popular" data={popular} />
      <MovieCarousel title="Top Rated" data={topRated} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 20, // Add some space at the top
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.background,
  },
});

