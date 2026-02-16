import axios from "axios";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODZlYTVlMjJkYmMwNzVhM2VjOTRmYmFlZmJmMzE2MSIsIm5iZiI6MTc3MDIxMzE4My4zOTM5OTk4LCJzdWIiOiI2OTgzNGYzZmQzNzgwNDdjM2FlNzRhNTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GVl6p_zSuZbrCedfjQExwVbW513cOhgaUqzcwhUrS_U";
const BASE_URL = "https://api.themoviedb.org/3";

// Хелпер для формирования полных ссылок на изображения
export const getImageUrl = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export const getTitles = async (page = 1) => {
  try {
    const response = await apiClient.get("/trending/all/day", {
      params: { page, language: "ru-RU" },
    });
    return {
      titles: response.data.results || [],
      nextPageToken:
        response.data.page < response.data.total_pages
          ? response.data.page + 1
          : null,
    };
  } catch (error) {
    console.error("[API GetTitles Error]", error.message);
    return { titles: [], nextPageToken: null };
  }
};

export const searchTitles = async (query, page = 1) => {
  if (!query) return [];
  try {
    const response = await apiClient.get("/search/multi", {
      params: { query, page, language: "ru-RU", include_adult: false },
    });
    return response.data.results.filter((i) => i.media_type !== "person") || [];
  } catch (error) {
    console.error("[API Search Error]", error.message);
    return [];
  }
};

export const getTopRated = async (activeType = "MOVIE", page = 1) => {
  try {
    const endpoint =
      activeType === "MOVIE" ? "/movie/top_rated" : "/tv/top_rated";
    const response = await apiClient.get(endpoint, {
      params: { page, language: "ru-RU" },
    });
    return {
      titles: response.data.results || [],
      nextToken:
        response.data.page < response.data.total_pages
          ? response.data.page + 1
          : null,
    };
  } catch (error) {
    console.error("[API Top Error]", error.message);
    return { titles: [], nextToken: null };
  }
};

export const getTitleDetails = async (id, type = "movie") => {
  try {
    // Используем append_to_response для получения видео и актеров за один запрос
    const response = await apiClient.get(`/${type}/${id}`, {
      params: {
        append_to_response: "videos,credits,release_dates",
        language: "ru-RU",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching details", error);
    return null;
  }
};
