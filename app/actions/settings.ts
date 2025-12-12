'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { put } from '@vercel/blob';

const configSchema = z.object({
    siteTitle: z.string().min(1, 'タイトルは必須です'),
    // logoUrl is typically not passed from valid form submission if using file, 
    // but handled separately.
});

export type ConfigState = {
    errors?: {
        siteTitle?: string[];
        logoFile?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;

// Fetch config helper
export async function getSystemConfig() {
    const config = await prisma.systemConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            siteTitle: 'SORA-MUSUBI',
        },
    });
    return config;
}

// Update action
export async function updateSystemConfig(prevState: ConfigState, formData: FormData): Promise<ConfigState> {
    const siteTitle = formData.get('siteTitle') as string;
    const logoFile = formData.get('logoFile') as File | null;

    if (!siteTitle) {
        return { errors: { siteTitle: ['タイトルは必須です'] } };
    }

    let logoUrlToUpdate: string | undefined = undefined;

    if (logoFile && logoFile.size > 0) {
        if (!logoFile.type.startsWith('image/')) {
            return { errors: { logoFile: ['画像ファイルを選択してください'] } };
        }

        try {
            // Upload to Vercel Blob
            const filename = `logo-${Date.now()}-${logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const blob = await put(filename, logoFile, {
                access: 'public',
            });
            logoUrlToUpdate = blob.url;
        } catch (e) {
            console.error('Upload failed:', e);
            return { message: '画像のアップロードに失敗しました (Blob Token設定を確認してください)' };
        }
    }

    try {
        await prisma.systemConfig.upsert({
            where: { id: 'default' },
            update: {
                siteTitle,
                ...(logoUrlToUpdate && { logoUrl: logoUrlToUpdate })
            },
            create: {
                id: 'default',
                siteTitle,
                logoUrl: logoUrlToUpdate
            },
        });
    } catch (e) {
        console.error('Failed to update config:', e);
        return { message: '設定の保存に失敗しました' };
    }

    revalidatePath('/');
    return { success: true, message: '設定を保存しました' };
}
