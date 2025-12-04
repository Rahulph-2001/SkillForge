import { persistor } from './store';


export const clearPersistedState = async (): Promise<void> => {
  try {
    console.log('[PersistUtils] Clearing persisted state...');
    await persistor.purge();
    console.log('[PersistUtils]  Persisted state cleared successfully');
  } catch (error) {
    console.error('[PersistUtils]  Error clearing persisted state:', error);
    throw error;
  }
};


export const pausePersistence = (): void => {
  console.log('[PersistUtils] Pausing persistence');
  persistor.pause();
};


export const resumePersistence = (): void => {
  console.log('[PersistUtils] Resuming persistence');
  persistor.persist();
};


export const flushPersistence = async (): Promise<void> => {
  try {
    console.log('[PersistUtils] Flushing persistence to storage...');
    await persistor.flush();
    console.log('[PersistUtils]  Persistence flushed successfully');
  } catch (error) {
    console.error('[PersistUtils]  Error flushing persistence:', error);
    throw error;
  }
};


export const isRehydrated = (): boolean => {
  const persistState = persistor.getState();
  return persistState.bootstrapped;
};


export const getPersistState = () => {
  return persistor.getState();
};


export const debugPersistedData = (): void => {
  try {
    const persistedData = localStorage.getItem('persist:root');
    if (persistedData) {
      console.log('[PersistUtils] Persisted data:', JSON.parse(persistedData));
    } else {
      console.log('[PersistUtils] No persisted data found');
    }
  } catch (error) {
    console.error('[PersistUtils] Error reading persisted data:', error);
  }
};
