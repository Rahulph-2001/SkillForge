import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateUserBalance } from '../store/slices/authSlice';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        console.log('[WebSocket] User logged out, disconnecting...');
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
      return;
    }

    // Don't reconnect if already connected
    if (socketRef.current?.connected) {
      return;
    }

    // Initialize WebSocket connection
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
    console.log('[WebSocket] Connecting to:', SOCKET_URL);

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[WebSocket] Connected:', socket.id);
      isConnectedRef.current = true;
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      isConnectedRef.current = false;
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      isConnectedRef.current = false;
    });

    // Listen for balance updates
    socket.on('user_balance_updated', (data: { credits: number; walletBalance: number; timestamp: string }) => {
      console.log('[WebSocket] Balance update received:', data);
      dispatch(updateUserBalance({
        credits: data.credits,
        walletBalance: data.walletBalance,
      }));
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      console.log('[WebSocket] Cleaning up connection...');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('user_balance_updated');
      socket.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    };
  }, [user, dispatch]);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, isConnected: isConnectedRef.current }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
