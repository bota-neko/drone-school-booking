const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'botaneko.adachi@gmail.com';
    const password = 'password123';
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.update({
        where: { email },
        data: {
            passwordHash: hashedPassword
        },
    });

    console.log('Admin password updated:', user.email);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
