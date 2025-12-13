'use server';

import { prisma } from '@/lib/prisma';
import { verifySession, createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

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

// Resend Verification Email Action
export async function resendVerificationEmail() {
    const session = await verifySession();
    if (!session?.isAuth) {
        return { success: false, message: 'ログインしてください。' };
    }

    const { sendVerificationEmail } = await import('@/lib/mail');

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return { success: false, message: 'ユーザーが見つかりません。' };
        }

        if (user.emailVerified) {
            return { success: false, message: '既に認証済みです。' };
        }

        // Generate new token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                tokenExpiry
            }
        });

        // Send email
        await sendVerificationEmail(user.email, verificationToken);

        if (!process.env.RESEND_API_KEY) {
            return { success: true, message: '【テストモード】認証メール送信をシミュレートしました。（実際には送信されていません）' };
        }

        return { success: true, message: '認証メールを再送しました。' };
    } catch (error) {
        console.error('Resend Error:', error);
        return { success: false, message: 'メール送信に失敗しました。' };
    }
}
