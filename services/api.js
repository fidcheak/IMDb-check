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

/**
 * ИСПРАВЛЕННЫЙ ТОП (ЧАРТЫ)
 * Теперь используем /titles с сортировкой SORT_BY_POPULARITY, как вы просили.
 * Это гарантирует, что данные придут в том же формате, что и на главной.
 */
export const getTopRated = async () => {
  console.log("[API] Loading Top Charts (via /titles)...");
  try {
    const response = await apiClient.get("/titles", {
      params: {
        limit: 20, // Топ-20
        sortBy: "SORT_BY_POPULARITY", // Ваше требование
        sortOrder: "ASC",
        info: "base_info",
        titleType: "movie", // Можно ограничить только фильмами
      },
    });

    // Так как используем /titles, структура будет стандартной: { titles: [...] }
    return response.data.titles || [];
  } catch (error) {
    console.error("[API Top Error]", error.message);
    return [];
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
