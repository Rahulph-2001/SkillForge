import React, { Component, ErrorInfo, ReactNode } from 'react';
import { clearAllPersistedState } from '../../utils/storageUtils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary to catch rendering errors
 * Prevents white screen of death
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    console.log('[ErrorBoundary] Resetting app state...');
    
    // Clear all persisted state
    clearAllPersistedState();
    
    // Reload the page
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 text-sm">
                We encountered an unexpected error. Don't worry, we can fix this!
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-xs font-mono text-gray-700 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Application
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              This will clear your cached data and reload the app
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
