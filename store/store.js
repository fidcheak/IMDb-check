import { configureStore } from '@reduxjs/toolkit';
import persistenceReducer from './reducer';

export const store = configureStore({
  reducer: {
    persistence: persistenceReducer,
  },
});
