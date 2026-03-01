// Express type augmentation is provided by src/types/express.d.ts (ambient declaration)
import { container } from './infrastructure/di/container';
import { TYPES } from './infrastructure/di/types';
import { type App } from './presentation/server';
import { Database } from './infrastructure/database/Database';
import { RedisService } from './infrastructure/services/RedisService';
import { env } from './config/env';
import { Server } from 'socket.io';
import { type IWebSocketService } from './domain/services/IWebSocketService';
import { logger } from './config/logger';

const port = env.PORT;
const appInstance = container.get<App>(TYPES.App).getInstance();

async function startServer() {
  try {
    const db = Database.getInstance();
    await db.healthCheck();
    logger.info('PostgreSQL connected');
    const redis = RedisService.getInstance();
    await redis.ping();
    logger.info('Redis healthy');

    // Start Job Queue Worker
    const jobQueueService = container.get<{ startProcessing(): void; startWorker(): Promise<void> }>(TYPES.IJobQueueService);
    await jobQueueService.startWorker();
    logger.info('Job Queue Worker started');

    // Start Interview Scheduler
    const interviewScheduler = container.get<{ start(): void }>(TYPES.InterviewScheduler);
    interviewScheduler.start();
    logger.info('Interview Scheduler started');

    // Start Cron Scheduler (Subscription Management)
    const cronScheduler = container.get<{ start(): void }>(TYPES.CronScheduler);
    cronScheduler.start();
    logger.info('Cron Scheduler started');


    const server = appInstance.listen(port, () => {
      logger.info(`Server running on port ${port} in ${env.NODE_ENV} mode`);
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

    // Initialize Video Call Signaling — CRITICAL: Without this, WebRTC offer/answer/ICE exchange never happens
    const signalingService = container.get<{ initialize(io: unknown): void }>(TYPES.IVideoCallSignalingService);
    signalingService.initialize(io);
    logger.info('Video Call Signaling Service initialized');

    // Handle port already in use error
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use!`);
        logger.error('Solutions:');
        logger.error('  1. Run: npm run dev:clean (kills port automatically)');
        logger.error('  2. Or manually: netstat -ano | findstr :3000');
        logger.error('  3. Then: taskkill /PID <PID> /F');
        process.exit(1);
      } else {
        logger.error(error, 'Server error');
        process.exit(1);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        logger.info('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION!');
      logger.error(err, 'Unhandled Exception Trace');
      process.exit(1);
    });
  } catch (error) {
    logger.error(error, 'Failed to connect to database or start server');
    process.exit(1);
  }
}

void startServer();