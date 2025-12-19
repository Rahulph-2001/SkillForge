import { container } from './infrastructure/di/container';
import { TYPES } from './infrastructure/di/types';
import { App } from './presentation/server';
import { Database } from './infrastructure/database/Database';
import { RedisService } from './infrastructure/services/RedisService';
import { env } from './config/env';
import { Server } from 'socket.io';
import { IWebSocketService } from './domain/services/IWebSocketService';

const port = env.PORT;
const appInstance = container.get<App>(TYPES.App).getInstance();

async function startServer() {
  try {
    const db = Database.getInstance();
    await db.healthCheck();
    console.log('PostgreSQL connected');
    const redis = RedisService.getInstance();
    await redis.ping();
    console.log('Redis healthy');

    // Start Job Queue Worker
    const jobQueueService = container.get<any>(TYPES.IJobQueueService);
    await jobQueueService.startWorker();
    console.log('Job Queue Worker started');


    const server = appInstance.listen(port, () => {
      console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
    });

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: [
          env.FRONTEND_URL,
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:5173',
          'http://localhost:5174'
        ],
        credentials: true
      }
    });

    const webSocketService = container.get<IWebSocketService>(TYPES.IWebSocketService);
    webSocketService.initialize(io);

    // Handle port already in use error
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(` Port ${port} is already in use!`);
        console.error(' Solutions:');
        console.error('   1. Run: npm run dev:clean (kills port automatically)');
        console.error('   2. Or manually: netstat -ano | findstr :3000');
        console.error('   3. Then: taskkill /PID <PID> /F');
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION!');
      console.error(err.name, err.message, err.stack);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to connect to database or start server:', error);
    process.exit(1);
  }
}

startServer();