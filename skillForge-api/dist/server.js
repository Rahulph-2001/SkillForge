"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="../types/express.d.ts" />
const container_1 = require("./infrastructure/di/container");
const types_1 = require("./infrastructure/di/types");
const Database_1 = require("./infrastructure/database/Database");
const RedisService_1 = require("./infrastructure/services/RedisService");
const env_1 = require("./config/env");
const socket_io_1 = require("socket.io");
const port = env_1.env.PORT;
const appInstance = container_1.container.get(types_1.TYPES.App).getInstance();
async function startServer() {
    try {
        const db = Database_1.Database.getInstance();
        await db.healthCheck();
        console.log('PostgreSQL connected');
        const redis = RedisService_1.RedisService.getInstance();
        await redis.ping();
        console.log('Redis healthy');
        // Start Job Queue Worker
        const jobQueueService = container_1.container.get(types_1.TYPES.IJobQueueService);
        await jobQueueService.startWorker();
        console.log('Job Queue Worker started');
        const server = appInstance.listen(port, () => {
            console.log(`Server running on port ${port} in ${env_1.env.NODE_ENV} mode`);
        });
        // Initialize Socket.IO
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: [
                    env_1.env.FRONTEND_URL,
                    'http://localhost:3000',
                    'http://localhost:3001',
                    'http://localhost:3002',
                    'http://localhost:5173',
                    'http://localhost:5174'
                ],
                credentials: true
            }
        });
        const webSocketService = container_1.container.get(types_1.TYPES.IWebSocketService);
        webSocketService.initialize(io);
        // Handle port already in use error
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(` Port ${port} is already in use!`);
                console.error(' Solutions:');
                console.error('   1. Run: npm run dev:clean (kills port automatically)');
                console.error('   2. Or manually: netstat -ano | findstr :3000');
                console.error('   3. Then: taskkill /PID <PID> /F');
                process.exit(1);
            }
            else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });
        // Graceful shutdown
        const gracefulShutdown = (signal) => {
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
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION!');
            console.error(err.name, err.message, err.stack);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('Failed to connect to database or start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map