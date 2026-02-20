import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  history: [],
};

const persistenceSlice = createSlice({
  name: 'persistence',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const index = state.favorites.findIndex((fav) => fav.id === item.id);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(item);
      }
    },
    addToHistory: (state, action) => {
      const item = action.payload;
      const index = state.history.findIndex((hist) => hist.id === item.id);
      if (index > -1) {
        state.history.splice(index, 1);
      }
      state.history.unshift(item);
      if (state.history.length > 20) {
        state.history.pop();
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { toggleFavorite, addToHistory, clearHistory } = persistenceSlice.actions;

export default persistenceSlice.reducer;
