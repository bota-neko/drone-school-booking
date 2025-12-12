const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    // Check if admin exists
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log('Admin already exists');
        // We can't easily recover the password hash, so we'll just reset it to a known one if we want to be sure, 
        // OR we just assume it's 'admin123' if that was the convention. 
        // To be safe for the user, let's update it to 'admin123'.
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await prisma.user.update({
            where: { email },
            data: { passwordHash: hashedPassword, role: 'ADMIN' }
        });
        console.log('Admin password reset to: admin123');
    } else {
        const hashedPassword = await bcrypt.hash('admin123', 12);
        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: 'ADMIN',
                profile: {
                    create: {
                        fullName: 'Admin User'
                    }
                }
            }
        });
        console.log('Admin created: admin@example.com / admin123');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
