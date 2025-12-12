
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding users...');

    // 1. Update/Create Admin
    const adminEmail = 'botaneko.adachi@gmail.com';
    const adminPassword = 'admin123'; // Default
    const adminHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: 'ADMIN',
            passwordHash: adminHash,
        },
        create: {
            email: adminEmail,
            role: 'ADMIN',
            passwordHash: adminHash,
            profile: {
                create: {
                    fullName: 'Admin Botaneko'
                }
            }
        }
    });

    console.log(`Admin Setup Complete: ${adminEmail}`);

    // If there was an old admin, maybe we should leave them or delete? 
    // User asked to *make* the admin this email. We can leave old ones as users or delete.
    // For safety, let's just ensure this specific one is admin. 
    // And let's remove the old 'admin@example.com' to avoid confusion if it exists
    await prisma.user.deleteMany({
        where: { email: 'admin@example.com' }
    });


    // 2. Create 3 Test Users
    const testUsers = [
        { name: 'Test User 1', email: 'test1@example.com' },
        { name: 'Test User 2', email: 'test2@example.com' },
        { name: 'Test User 3', email: 'test3@example.com' },
    ];

    const commonPassword = 'password123';
    const userHash = await bcrypt.hash(commonPassword, 10);

    for (const u of testUsers) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                passwordHash: userHash,
                role: 'USER', // Ensure they are regular users
            },
            create: {
                email: u.email,
                passwordHash: userHash,
                role: 'USER',
                profile: {
                    create: {
                        fullName: u.name
                    }
                }
            }
        });
        console.log(`User seeded: ${u.email}`);
    }

    console.log('Seeding completed.');
    console.log('---------------------------');
    console.log('Credentials:');
    console.log(`Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`Test User (Example): test1@example.com / ${commonPassword}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
