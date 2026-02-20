import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, addToHistory, clearHistory } from '../store/reducer';

export const usePersistence = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.persistence.favorites);
  const history = useSelector((state) => state.persistence.history);

  const handleToggleFavorite = (item) => {
    dispatch(toggleFavorite(item));
  };

  const handleAddToHistory = (item) => {
    dispatch(addToHistory(item));
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  return {
    favorites,
    history,
    toggleFavorite: handleToggleFavorite,
    addToHistory: handleAddToHistory,
    clearHistory: handleClearHistory,
    isFavorite,
  };
};
