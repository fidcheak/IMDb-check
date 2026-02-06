import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.imdbapi.dev";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Главная лента (как и было, работает)
 */
export const getTitles = async (pageToken = null) => {
  try {
    const params = {
      limit: 10,
      info: "base_info",
      sortBy: "SORT_BY_POPULARITY", // Сортировка по умолчанию
      sortOrder: "ASC",
      titleType: "movie,tvSeries",
    };
    if (pageToken) params.pageToken = pageToken;

    const response = await apiClient.get("/titles", { params });

    // Пытаемся достать токен из разных возможных полей
    const nextToken = response.data.nextPage || response.data.pageToken || null;

    return {
      titles: response.data.titles || [],
      nextPageToken: nextToken,
    };
  } catch (error) {
    console.error("[API GetTitles Error]", error.message);
    return { titles: [], nextPageToken: null };
  }
};

/**
 * ИСПРАВЛЕННЫЙ ПОИСК
 * Мы используем endpoint /search/titles.
 * Если он не работает, смотрите логи в консоли.
 */
export const searchTitles = async (query) => {
  if (!query) return [];
  console.log(`[API] Start Search: "${query}"`);

  try {
    // В некоторых версиях API параметр называется 'exact' или просто 'query'
    // Убираем 'info', так как поиск может возвращать упрощенную структуру
    const response = await apiClient.get("/search/titles", {
      params: {
        query: query,
        limit: 20,
      },
    });

    console.log("[API] Search Response Status:", response.status);

    // Логируем ключи ответа, чтобы понять структуру
    if (response.data) {
      console.log("[API] Search Data Keys:", Object.keys(response.data));
    }

    // Обычно поиск возвращает массив в поле 'results' или 'titles'
    return response.data.results || response.data.titles || [];
  } catch (error) {
    console.error("[API Search Error]", error.response?.data || error.message);
    return [];
  }
};

export const getTopRated = async (activeType = "MOVIE", token = null) => {
  try {
    const response = await apiClient.get("/titles", {
      params: {
        limit: 20,
        pageToken: token, // Передаем токен вместо номера страницы
        sortBy: "SORT_BY_USER_RATING_COUNT",
        sortOrder: "DESC",
        info: "base_info",
        types: activeType, // В доке указано types (array)
      },
    });

    return {
      titles: response.data.titles || [],
      nextToken: response.data.nextPageToken || null, // Запоминаем токен для следующего шага
    };
  } catch (error) {
    console.error("[API Top Error]", error.message);
    return { titles: [], nextToken: null };
  }
};

export const getTitleDetails = async (id) => {
  try {
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
