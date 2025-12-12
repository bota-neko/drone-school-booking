const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const user = await prisma.user.findUnique({
        where: { email: 'testuser_final_3@example.com' },
        include: { profile: true }
    });
    console.log(JSON.stringify(user, null, 2));
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
