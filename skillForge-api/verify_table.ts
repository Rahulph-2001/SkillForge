
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking for mcqImportJob table...');
        const count = await prisma.mcqImportJob.count();
        console.log(`Success! Table exists. Count: ${count}`);
    } catch (error) {
        console.error('Error accessing table:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
