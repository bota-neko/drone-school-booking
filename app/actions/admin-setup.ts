'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function promoteUserToAdmin(formData: FormData) {
    const email = formData.get('email') as string;
    const secret = formData.get('secret') as string;

    if (secret !== 'antigravity-magic-key') {
        return { success: false, message: 'Invalid secret key' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, message: `User not found: ${email}` };
        }

        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });

        revalidatePath('/');
        return { success: true, message: `Success! ${email} is now an ADMIN. Please Logout and Login again.` };
    } catch (e) {
        return { success: false, message: 'Database error ' + JSON.stringify(e) };
    }
}
