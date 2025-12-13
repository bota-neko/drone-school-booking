import { prisma } from './lib/prisma';

async function main() {
    const currentEmail = 'botaneko.adachi@gmail.com';
    const newEmail = 'admin-temp@example.com';

    try {
        const user = await prisma.user.update({
            where: { email: currentEmail },
            data: { email: newEmail },
        });
        console.log(`Successfully renamed Admin email from ${currentEmail} to ${newEmail}`);
        console.log('You can now sign up with ' + currentEmail);
    } catch (error) {
        console.error('Error renaming user:', error);
    }
}

main();
