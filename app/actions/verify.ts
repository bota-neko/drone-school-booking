'use server';

import { prisma } from '@/lib/prisma';
import { verifySession, createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function verifyEmailAction(token: string) {
    if (!token) return { success: false, message: 'Invalid token' };

    try {
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return { success: false, message: 'トークンが無効または期限切れです。' };
        }

        if (user.tokenExpiry && user.tokenExpiry < new Date()) {
            return { success: false, message: 'トークンの有効期限が切れています。' };
        }

        // Verify User
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null, // Clear token
                tokenExpiry: null
            }
        });

        // If user is already logged in, we might want to refresh session or just let them be.
        // If not logged in, we could log them in? 
        // For simplicity, just return success and let page verify.

        return { success: true, message: 'メールアドレスの確認が完了しました！' };
    } catch (error) {
        console.error("Verification failed:", error);
        return { success: false, message: '認証に失敗しました。' };
    }
}
