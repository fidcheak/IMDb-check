import axios from "axios";

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyODZlYTVlMjJkYmMwNzVhM2VjOTRmYmFlZmJmMzE2MSIsIm5iZiI6MTc3MDIxMzE4My4zOTM5OTk4LCJzdWIiOiI2OTgzNGYzZmQzNzgwNDdjM2FlNzRhNTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GVl6p_zSuZbrCedfjQExwVbW513cOhgaUqzcwhUrS_U";
const BASE_URL = "https://api.themoviedb.org/3";

export const getImageUrl = (path, size = "w500") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : "https://via.placeholder.com/500x750?text=Нет+фото";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
  },
});

// 1. Главная (Тренды)
export const getTitles = async (page = 1) => {
  try {
    const response = await apiClient.get("/trending/all/day", {
      params: { page, language: "ru-RU" },
    });
    const currentPage = response.data.page;
    const totalPages = response.data.total_pages;
    return {
      titles: response.data.results || [],
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
  } catch (error) {
    return { titles: [], nextPage: null };
  }
};

// 2. Поиск (исправлено!)
export const searchTitles = async (query, page = 1) => {
  if (!query) return { titles: [], nextPage: null };
  try {
    const response = await apiClient.get("/search/multi", {
      params: { query, page, language: "ru-RU", include_adult: false },
    });
    const currentPage = response.data.page;
    const totalPages = response.data.total_pages;
    // Фильтруем, чтобы оставить только фильмы и сериалы (убираем актеров)
    const filtered = (response.data.results || []).filter(
      (i) => i.media_type !== "person",
    );
    return {
      titles: filtered,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
  } catch (error) {
    return { titles: [], nextPage: null };
  }
};

// 3. Рейтинг
export const getTopRated = async (activeType = "MOVIE", page = 1) => {
  const type = activeType === "MOVIE" ? "movie" : "tv";
  try {
    const response = await apiClient.get(`/${type}/top_rated`, {
      params: { page, language: "ru-RU" },
    });
    const currentPage = response.data.page;
    const totalPages = response.data.total_pages;
    return {
      titles: response.data.results || [],
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
  } catch (error) {
    return { titles: [], nextPage: null };
  }
};

// 4. Детали
export const getTitleDetails = async (id, type = "movie") => {
  try {
    const response = await apiClient.get(`/${type}/${id}`, {
      params: { append_to_response: "credits,videos", language: "ru-RU" },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// 5. Детали по персоне
export const getPersonDetails = async (personId) => {
  try {
    const response = await apiClient.get(`/person/${personId}`, {
      params: {
        append_to_response: "combined_credits,images",
        language: "ru-RU",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
