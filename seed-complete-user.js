const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'complete_user@example.com';
    const password = 'password123';
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            passwordHash: hashedPassword,
            role: 'USER',
            profile: {
                create: {
                    fullName: 'Complete User',
                    phone: '090-9999-8888',
                    age: 35,
                    address: 'Tokyo, Minato-ku',
                    droneHistory: 'DJI Mavic 3, 2 years exp',
                    emergencyContact: 'Mother 080-1111-2222',
                    termsAccepted: true,
                    privacyAccepted: true,
                    riskAccepted: true
                }
            }
        },
    });

    console.log({ user });
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
