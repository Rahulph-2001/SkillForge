"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(db, model) {
        this.model = model;
        this.prisma = db.getClient();
    }
    async create(data) {
        const modelClient = this.prisma[this.model];
        return modelClient.create({ data });
    }
    async findById(id) {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        return modelClient.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        return modelClient.findUnique({ where: { email } });
    }
    async findAll() {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        return modelClient.findMany();
    }
    async updateById(id, data) {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        return modelClient.update({ where: { id }, data });
    }
    async delete(id) {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        await modelClient.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
    }
    async getOne(query) {
        // Using 'any' here is necessary for Prisma's dynamic model access pattern
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modelClient = this.prisma[this.model];
        const result = await modelClient.findFirst(query);
        return result || null;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map