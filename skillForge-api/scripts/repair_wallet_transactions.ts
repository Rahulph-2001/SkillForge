import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting wallet transaction repair...');

    // Find users with positive wallet balance
    const users = await prisma.user.findMany({
        where: {
            walletBalance: {
                gt: 0
            }
        }
    });

    console.log(`Found ${users.length} users with positive balance but potentially missing transactions.`);

    for (const user of users) {
        // Check if any transactions exist for this user
        const transactionCount = await prisma.userWalletTransaction.count({
            where: { userId: user.id }
        });

        if (transactionCount === 0) {
            console.log(`Creating opening balance transaction for user: ${user.email} (${user.walletBalance})`);

            await prisma.userWalletTransaction.create({
                data: {
                    id: uuidv4(),
                    userId: user.id,
                    type: 'PROJECT_EARNING', // Or a new type 'OPENING_BALANCE' if enum allowed, but PROJECT_EARNING is safe
                    amount: Number(user.walletBalance),
                    currency: 'INR',
                    source: 'SYSTEM',
                    description: 'Opening Balance / Adjustment',
                    previousBalance: 0,
                    newBalance: Number(user.walletBalance),
                    status: 'COMPLETED',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        } else {
            console.log(`User ${user.email} already has transactions. Skipping.`);
        }
    }

    console.log('Repair completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
