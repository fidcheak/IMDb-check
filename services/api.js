import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.imdbapi.dev";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTitles = async (page = 1, limit = 10) => {
  try {
    // Note: The API documentation defines how pagination tokens work.
    // Assuming simple limit/page params or token based on API spec.
    // For this example, we request titles lists.
    const response = await apiClient.get("/titles", {
      params: { limit, page, info: "base_info" }, // info param to get your specific JSON structure
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching titles", error);
    return { titles: [] };
  }
};

export const searchTitles = async (query) => {
  if (!query) return [];
  try {
    const response = await apiClient.get("/search/titles", {
      params: { query },
    });
    // Normalizing search response to match title structure if needed
    return response.data.results || [];
  } catch (error) {
    console.error("Error searching", error);
    return [];
  }
};

export const getTitleDetails = async (id) => {
  try {
    // Fetch basic details and other endpoints concurrently for performance
    const [details, releaseDates] = await Promise.all([
      apiClient.get(`/titles/${id}`),
      apiClient.get(`/titles/${id}/releaseDates`),
    ]);
    return { ...details.data, releaseDates: releaseDates.data };
  } catch (error) {
    console.error("Error fetching details", error);
    return null;
  }
};

export const getChartData = async () => {
  try {
    // Пример запроса к StarMeter или Top Rated
    const response = await apiClient.get("/chart/starmeter");

    // Часто API возвращает: { entries: [ { item: { ...movieData }, ... } ] }
    // Нам нужно "вытащить" данные фильма на верхний уровень, чтобы MovieCard их понял.
    const rawData = response.data.entries || response.data.titles || [];

    return rawData.map((entry) => {
      // Если данные фильма вложены в поле 'item' (стандарт для чартов), достаем их.
      // Если нет, возвращаем как есть.
      if (entry.item) {
        return {
          ...entry.item,
          rank: entry.currentRank, // Сохраняем ранг, если он есть
        };
      }
      return entry;
    });
  } catch (error) {
    console.error("Error fetching chart", error);
    return [];
  }
};
