const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin_verification@example.com';
    const password = 'password123';
    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'ADMIN',
            passwordHash: hashedPassword
        },
        create: {
            email,
            passwordHash: hashedPassword,
            role: 'ADMIN',
            profile: {
                create: {
                    fullName: 'Admin Verification',
                    phone: '090-0000-0000',
                    age: 99,
                    address: 'Admin HQ',
                    emergencyContact: 'None',
                    termsAccepted: true,
                    privacyAccepted: true,
                    riskAccepted: true
                }
            }
        },
    });

    console.log('Admin created:', user);
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
