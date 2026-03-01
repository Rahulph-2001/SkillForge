
export const clearAllPersistedState = (): void => {
  try {
    console.log('[StorageUtils] Clearing all persisted state...');

    // Remove redux-persist data
    localStorage.removeItem('persist:root');

    // Remove any other auth-related data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    console.log('[StorageUtils] ✅ Cleared persisted state successfully');
  } catch (error) {
    console.error('[StorageUtils] ❌ Error clearing persisted state:', error);
  }
};


export const checkStorageHealth = (): boolean => {
  try {
    const persistedData = localStorage.getItem('persist:root');
    if (!persistedData) {
      return true; // No data is fine
    }

    // Try to parse the data
    JSON.parse(persistedData);
    return true;
  } catch (error) {
    console.error('[StorageUtils] Corrupted localStorage detected:', error);
    return false;
  }
};


export const repairStorage = (): void => {
  if (!checkStorageHealth()) {
    console.warn('[StorageUtils] Repairing corrupted storage...');
    clearAllPersistedState();
  }
};


export const hasValidUserData = (): boolean => {
  try {
    const persistedData = localStorage.getItem('persist:root');
    if (!persistedData) return false;

    const parsed = JSON.parse(persistedData) as unknown;
    if (!parsed || typeof parsed !== 'object' || !('auth' in parsed)) return false;

    const authString = (parsed as Record<string, unknown>).auth;
    if (typeof authString !== 'string') return false;

    const authData = JSON.parse(authString) as unknown;
    if (!authData || typeof authData !== 'object') return false;

    return !!(authData as Record<string, unknown>).user;
  } catch {
    return false;
  }
};
