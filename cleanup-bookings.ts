
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const deleted = await prisma.booking.deleteMany({
        where: {
            status: 'CANCELLED',
        },
    });
    console.log(`Deleted ${deleted.count} cancelled bookings.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
