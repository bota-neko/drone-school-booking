const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'user@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                passwordHash: hashedPassword,
                role: 'USER',
                profile: {
                    create: {
                        fullName: 'General User'
                    }
                }
            }
        });
        console.log('User created:', user.email);
    } catch (e) {
        console.error(e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
