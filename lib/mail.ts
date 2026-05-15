import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface EventDetails {
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string | null;
}

async function getMailSettings() {
    const { prisma } = await import('./prisma');
    const config = await prisma.systemConfig.findUnique({ where: { id: 'default' } });
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { email: true }
    });

    return {
        senderName: process.env.SENDER_NAME || config?.siteTitle || 'Drone School',
        senderEmail: process.env.SENDER_EMAIL_ADDRESS || 'onboarding@resend.dev',
        adminEmail: process.env.ADMIN_EMAIL || admin?.email || 'botaneko.adachi@gmail.com'
    };
}

function formatInJST(date: Date, options: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat('ja-JP', {
        ...options,
        timeZone: 'Asia/Tokyo',
    }).format(date);
}

export async function sendBookingConfirmation(email: string, event: EventDetails) {
    const { senderName, senderEmail } = await getMailSettings();
    
    if (!process.env.RESEND_API_KEY) {
        console.log('--- [DEV] EMAIL SIMULATION: BOOKING ---');
        return;
    }

    try {
        const dateStr = formatInJST(event.startTime, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        const startTimeStr = formatInJST(event.startTime, { hour: '2-digit', minute: '2-digit', hour12: false });
        const endTimeStr = formatInJST(event.endTime, { hour: '2-digit', minute: '2-digit', hour12: false });

        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: email,
            subject: `【予約完了】${event.title} (${dateStr})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">ご予約ありがとうございます</h2>
                    <p>以下の内容で予約を承りました。</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr} ${startTimeStr} - ${endTimeStr}</p>
                        <p><strong>場所:</strong> ${event.location || '現地'}</p>
                    </div>
                    <p>当日お会いできるのを楽しみにしています。</p>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}

export async function sendCancellationEmail(email: string, event: EventDetails) {
    const { senderName, senderEmail } = await getMailSettings();
    if (!process.env.RESEND_API_KEY) return;

    try {
        const dateStr = formatInJST(event.startTime, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: email,
            subject: `【予約キャンセル】${event.title} (${dateStr})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">予約キャンセルのご連絡</h2>
                    <p>以下の予約をキャンセルいたしました。</p>
                    <div style="background: #fff0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr}</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}

export async function sendAdminBookingNotification(event: EventDetails, userEmail: string, userName: string) {
    const { senderName, senderEmail, adminEmail } = await getMailSettings();
    if (!process.env.RESEND_API_KEY) return;

    try {
        const dateStr = formatInJST(event.startTime, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        const timeStr = `${formatInJST(event.startTime, { hour: '2-digit', minute: '2-digit', hour12: false })} - ${formatInJST(event.endTime, { hour: '2-digit', minute: '2-digit', hour12: false })}`;

        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: adminEmail,
            subject: `【予約通知】新規予約が入りました (${event.title})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">新規予約のお知らせ</h2>
                    <div style="background: #eef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>名前:</strong> ${userName}</p>
                        <p><strong>メール:</strong> ${userEmail}</p>
                    </div>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr} ${timeStr}</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}

export async function sendAdminNewUserNotification(userEmail: string, userName: string) {
    const { senderName, senderEmail, adminEmail } = await getMailSettings();
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: adminEmail,
            subject: '【ユーザー登録通知】新規ユーザーが登録されました',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">新規ユーザー登録のお知らせ</h2>
                    <div style="background: #eef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>名前:</strong> ${userName}</p>
                        <p><strong>メール:</strong> ${userEmail}</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}

export async function sendVerificationEmail(email: string, token: string) {
    const { senderName, senderEmail } = await getMailSettings();
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: email,
            subject: '【重要】メールアドレスの確認をお願いします',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>メールアドレスの確認</h1>
                    <p>ご登録ありがとうございます。以下のリンクをクリックして完了してください。</p>
                    <p><a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">確認する</a></p>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}

export async function sendAdminCancellationNotification(event: any, user: any) {
    const { senderName, senderEmail, adminEmail } = await getMailSettings();
    if (!process.env.RESEND_API_KEY) return;

    try {
        const dateStr = formatInJST(event.startTime, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
        await resend.emails.send({
            from: `${senderName} <${senderEmail}>`,
            to: adminEmail,
            subject: '【キャンセル発生】予約がキャンセルされました',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d32f2f;">予約キャンセルのお知らせ</h2>
                    <div style="background: #fff5f5; padding: 15px; border-radius: 5px; border: 1px solid #ffcdd2;">
                        <p><strong>ユーザー:</strong> ${user.profile?.fullName || 'No Name'} (${user.email})</p>
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr}</p>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('[Email] Failed:', error);
    }
}
