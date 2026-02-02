
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client...');

    // Check if property exists
    if ('userWalletTransaction' in prisma) {
        console.log('✅ prisma.userWalletTransaction exists');

        try {
            // @ts-ignore
            const count = await prisma.userWalletTransaction.count();
            console.log(`✅ Transaction Count: ${count}`);

            // @ts-ignore
            const transactions = await prisma.userWalletTransaction.findMany({ take: 5 });
            console.log('Recent transactions:', JSON.stringify(transactions, null, 2));

            // Check users
            const users = await prisma.user.findMany({
                take: 1,
                select: { id: true, email: true, walletBalance: true, credits: true }
            });
            console.log('User sample:', JSON.stringify(users, null, 2));

        } catch (e: any) {
            console.error('❌ Error querying userWalletTransaction:', e.message);
        }

    } else {
        console.error('❌ prisma.userWalletTransaction DOES NOT EXIST');
        const keys = Object.keys(prisma);
        console.log('Available keys on prisma client:', keys.filter(k => !k.startsWith('_')));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
