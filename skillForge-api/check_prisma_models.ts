import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Available Prisma Client Properties:');
    console.log(Object.keys(prisma));
    // keys might not show model names directly if they are getters on the prototype
    // simpler way is to try to access it via $name or look at d.ts, but let's try to inspect
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
