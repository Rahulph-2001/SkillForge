"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
class PrismaService {
    constructor() { }
    static getInstance() {
        if (!PrismaService.instance) {
            PrismaService.instance = new client_1.PrismaClient({
                log: process.env.NODE_ENV === 'development'
                    ? ['query', 'error', 'warn']
                    : ['error'],
            });
            process.on('beforeExit', async () => {
                await PrismaService.disconnect();
            });
        }
        return PrismaService.instance;
    }
    static async disconnect() {
        if (PrismaService.instance) {
            await PrismaService.instance.$disconnect();
            console.log('Prisma disconnected');
        }
    }
}
exports.prisma = PrismaService.getInstance();
exports.default = PrismaService;
//# sourceMappingURL=prisma.js.map