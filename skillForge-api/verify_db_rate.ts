import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const setting = await prisma.systemSettings.findUnique({
        where: { key: 'CREDIT_CONVERSION_RATE' },
    });
    console.log('---------------------------------------------------');
    console.log('Current Credit Conversion Rate in DB:', setting);
    console.log('---------------------------------------------------');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
