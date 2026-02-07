import { FlatList, StyleSheet, Text, View } from "react-native";
import PosterCard from "./PosterCard";
import { Colors } from "../constants/theme";

const MovieCarousel = ({ title, data }) => {
  if (!data || data.length === 0) {
    return null; // Don't render if there's no data
  }

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PosterCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginBottom: 24,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
});

export default MovieCarousel;
