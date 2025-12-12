
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(11, 0, 0, 0);

    const event = await prisma.event.create({
        data: {
            title: 'Test Event For Cancellation',
            description: 'Test Description',
            startTime: tomorrow,
            endTime: end,
            location: 'Test Location',
            maxAttendees: 5,
            price: 1000,
            type: 'SEMINAR', // or whichever enum
            // seriesId: null
        }
    });
    console.log('Created event:', event.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
