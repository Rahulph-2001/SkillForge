import { container } from './infrastructure/di/container';
import { TYPES } from './infrastructure/di/types';
import { App } from './presentation/server';
import { Database } from './infrastructure/database/Database';
import { RedisService } from './infrastructure/services/RedisService';
import { env } from './config/env';

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
    appInstance.listen(port, () => {
      console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
    });
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