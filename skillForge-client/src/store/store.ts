import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authReducer from './slices/authSlice';



// Root reducer combining all slices
const rootReducer = combineReducers({
  auth: authReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root', // Key for localStorage
  version: 1, // Version for migrations
  storage, // Use localStorage
  whitelist: ['auth'], // Only persist auth slice (add more slices here if needed)
  // blacklist: [], // Slices to NOT persist (if needed)
};

// Middleware to reset transient UI states after rehydration
const resetTransientStatesMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);
  
  // After rehydration, reset transient UI states
  if (action.type === REHYDRATE) {
    console.log('[Store] Rehydration detected, resetting transient UI states');
    const state = store.getState();
    if (state.auth) {
      // Reset loading and error states that shouldn't persist
      store.dispatch({ type: 'auth/resetTransientStates' });
    }
  }
  
  return result;
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'auth/signup/rejected',
          'auth/login/rejected',
          'auth/adminLogin/rejected',
          'auth/resetTransientStates',
        ],
        
        ignoredPaths: ['auth.error'],
      },
    }).concat(resetTransientStatesMiddleware),
});

// Create persistor for PersistGate
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

