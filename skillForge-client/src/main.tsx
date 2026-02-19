import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { store, persistor } from './store/store.ts'
import { repairStorage, checkStorageHealth } from './utils/storageUtils'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { WebSocketProvider } from './contexts/WebSocketContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// Check and repair storage before app loads
console.log('[App] Checking localStorage health...');
repairStorage();

// Wrapper component to handle PersistGate timeout
function AppWrapper() {
  const [showApp, setShowApp] = useState(false);
  const [persistError, setPersistError] = useState(false);

  useEffect(() => {
    // Set a timeout for PersistGate - if it takes more than 3 seconds, something is wrong
    const timeout = setTimeout(() => {
      console.error('[PersistGate] Rehydration timeout - clearing persisted state');
      setPersistError(true);

      // Clear corrupted localStorage
      if (!checkStorageHealth()) {
        repairStorage();
      }

      // Force show app anyway
      setShowApp(true);
    }, 3000);

    // Check if already bootstrapped
    const checkBootstrap = setInterval(() => {
      const state = persistor.getState();
      if (state.bootstrapped) {
        clearInterval(checkBootstrap);
        clearTimeout(timeout);
        setShowApp(true);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearInterval(checkBootstrap);
    };
  }, []);

  // Use showApp to avoid unused variable warning if needed, or just suppress it
  useEffect(() => {
    if (showApp) {
      console.log('App is ready to show');
    }
  }, [showApp]);

  if (persistError) {
    // If there was an error, render app without PersistGate
    return (
      <WebSocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WebSocketProvider>
    );
  }



  return (
    <PersistGate
      loading={
        <div className="flex items-center justify-center min-h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading SkillForge...</p>
          </div>
        </div>
      }
      persistor={persistor}
      onBeforeLift={() => {
        console.log('[PersistGate] Rehydration complete');
      }}
    >
      <WebSocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WebSocketProvider>
    </PersistGate>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AppWrapper />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
)
