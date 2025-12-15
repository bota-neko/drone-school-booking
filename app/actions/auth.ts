'use server'

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { sendAdminNewUserNotification, sendVerificationEmail } from '@/lib/mail';
import { randomBytes } from 'crypto';

const signupSchema = z.object({
    fullName: z.string().min(1, "名前を入力してください"),
    email: z.string().email("メールアドレスの形式が正しくありません"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください"),
    phone: z.string().min(1, "電話番号を入力してください"),
    age: z.coerce.number().min(18, "18歳以上である必要があります").catch(0),
    address: z.string().min(1, "住所を入力してください"),
    droneHistory: z.string().optional(),
    emergencyContact: z.string().min(1, "緊急連絡先を入力してください"),
    // Checkboxes are missing from formData if unchecked.
    // We treat them as unknown, then refine.
    termsAccepted: z.unknown().refine(val => val === 'on', { message: "利用規約への同意が必要です" }),
    privacyAccepted: z.unknown().refine(val => val === 'on', { message: "個人情報保護方針への同意が必要です" }),
    riskAccepted: z.unknown().refine(val => val === 'on', { message: "リスク説明への同意が必要です" }),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type AuthState = {
    errors?: {
        email?: string[];
        password?: string[];
        fullName?: string[];
        phone?: string[];
        age?: string[];
        address?: string[];
        droneHistory?: string[];
        emergencyContact?: string[];
        termsAccepted?: string[];
        privacyAccepted?: string[];
        riskAccepted?: string[];
    };
    message?: string;
    success?: boolean;
    redirectUrl?: string;
} | undefined;

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const validatedFields = signupSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { fullName, email, password, phone, age, address, droneHistory, emergencyContact } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                errors: {
                    email: ['Email already in use'],
                }
            };
        }

        const hashedPassword = await hashPassword(password);

        // Generate Verification Token
        const verificationToken = randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await prisma.user.create({
            data: {
                email,
                role: 'USER', // Explicitly set role to USER for safety
                passwordHash: hashedPassword,
                verificationToken,
                tokenExpiry,
                profile: {
                    create: {
                        fullName,
                        phone,
                        age,
                        address,
                        droneHistory: droneHistory || "なし",
                        emergencyContact,
                        termsAccepted: true,
                        privacyAccepted: true,
                        riskAccepted: true
                    }
                }
            },
        });

        // Send Verification Email
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (emailError: any) {
            console.error('Email sending failed, rolling back user creation:', emailError);
            // Rollback: Delete the user we just created so they can try again.
            await prisma.user.delete({ where: { id: user.id } });

            return {
                message: `メール送信に失敗しました: ${emailError.message || 'Unknown error'}`,
            };
        }

        await createSession(user.id, user.role);
    } catch (error) {
        console.error('Signup error:', error);

        return {
            message: 'Database Error: Failed to Create User.',
        };
    }

    console.log('Signup success');
    // Notify Admin
    try {
        await sendAdminNewUserNotification(email, fullName);
    } catch (e) {
        console.error("Failed to send admin notification", e);
    }

    return { success: true };
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
    const validatedFields = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return {
            message: 'Invalid credentials',
        };
    }

    const passwordsMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordsMatch) {
        return {
            message: 'Invalid credentials',
        };
    }

    await createSession(user.id, user.role);
    console.log('Session created');

    const redirectUrl = user.role === 'ADMIN' ? '/admin' : '/my-page';
    return { success: true, redirectUrl };
}

export async function logout() {
    await deleteSession();
    return { success: true };
}
