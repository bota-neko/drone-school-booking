import { Resend } from 'resend';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// Initialize Resend with API Key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER_EMAIL = 'onboarding@resend.dev'; // Default Resend Testing Domain
const SENDER_NAME = 'Drone School';
const ADMIN_EMAIL = 'botaneko.adachi@gmail.com';

interface EventDetails {
    title: string;
    startTime: Date;
    endTime: Date;
    location?: string | null;
}

export async function sendBookingConfirmation(email: string, event: EventDetails) {
    // Development Fallback
    if (!process.env.RESEND_API_KEY) {
        console.log('--- [DEV] EMAIL SIMULATION: BOOKING CONFIRMATION ---');
        console.log(`To: ${email}`);
        console.log(`Event: ${event.title}`);
        console.log(`Time: ${format(event.startTime, 'yyyy-MM-dd HH:mm', { locale: ja })}`);
        console.log('----------------------------------------------------');
        return;
    }

    try {
        const dateStr = format(event.startTime, 'yyyy年MM月dd日 (EEE)', { locale: ja });
        const timeStr = `${format(event.startTime, 'HH:mm')} - ${format(event.endTime, 'HH:mm')}`;

        await resend.emails.send({
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            to: email,
            subject: `【予約完了】${event.title} (${dateStr})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">ご予約ありがとうございます</h2>
                    <p>以下の内容で予約を承りました。</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr} ${timeStr}</p>
                        <p><strong>場所:</strong> ${event.location || '現地'}</p>
                    </div>

                    <p>当日お会いできるのを楽しみにしています。</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #666;">※キャンセルはマイページから行えます。</p>
                </div>
            `
        });
        console.log(`[Email] Booking confirmation sent to ${email}`);
    } catch (error) {
        console.error('[Email] Failed to send booking confirmation:', error);
        // Do not throw error to avoid killing the booking flow even if email fails
    }
}

export async function sendCancellationEmail(email: string, event: EventDetails) {
    // Development Fallback
    if (!process.env.RESEND_API_KEY) {
        console.log('--- [DEV] EMAIL SIMULATION: CANCELLATION ---');
        console.log(`To: ${email}`);
        console.log('--------------------------------------------');
        return;
    }

    try {
        const dateStr = format(event.startTime, 'yyyy年MM月dd日 (EEE)', { locale: ja });

        await resend.emails.send({
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
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

                    <p>またのご利用をお待ちしております。</p>
                </div>
            `
        });
        console.log(`[Email] Cancellation notice sent to ${email}`);
    } catch (error) {
        console.error('[Email] Failed to send cancellation email:', error);
    }
}

export async function sendAdminBookingNotification(event: EventDetails, userEmail: string, userName: string) {
    // Development Fallback
    if (!process.env.RESEND_API_KEY) {
        console.log('--- [DEV] EMAIL SIMULATION: ADMIN NOTIFICATION ---');
        console.log(`To: ${ADMIN_EMAIL}`);
        console.log(`User: ${userName} (${userEmail})`);
        console.log(`Event: ${event.title}`);
        console.log('--------------------------------------------------');
        return;
    }

    try {
        const dateStr = format(event.startTime, 'yyyy年MM月dd日 (EEE)', { locale: ja });
        const timeStr = `${format(event.startTime, 'HH:mm')} - ${format(event.endTime, 'HH:mm')}`;

        await resend.emails.send({
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `【予約通知】新規予約が入りました (${event.title})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">新規予約のお知らせ</h2>
                    <p>ユーザーから新しい予約が入りました。</p>
                    
                    <div style="background: #eef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #444;">予約者情報</h3>
                        <p><strong>名前:</strong> ${userName}</p>
                        <p><strong>メール:</strong> ${userEmail}</p>
                    </div>

                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #444;">予約内容</h3>
                        <p><strong>イベント:</strong> ${event.title}</p>
                        <p><strong>日時:</strong> ${dateStr} ${timeStr}</p>
                        <p><strong>場所:</strong> ${event.location || '現地'}</p>
                    </div>

                    <p style="font-size: 0.8rem; color: #666;">管理画面から詳細を確認してください。</p>
                </div>
            `
        });
        console.log(`[Email] Admin notification sent to ${ADMIN_EMAIL}`);
    } catch (error) {
        console.error('[Email] Failed to send admin notification:', error);
    }
}

export async function sendAdminNewUserNotification(userEmail: string, userName: string) {
    // Development Fallback
    if (!process.env.RESEND_API_KEY) {
        console.log('--- [DEV] EMAIL SIMULATION: NEW USER NOTIFICATION ---');
        console.log(`To: ${ADMIN_EMAIL}`);
        console.log(`New User: ${userName} (${userEmail})`);
        console.log('-----------------------------------------------------');
        return;
    }

    try {
        await resend.emails.send({
            from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `【ユーザー登録通知】新規ユーザーが登録されました`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">新規ユーザー登録のお知らせ</h2>
                    <p>新しいユーザーがアカウントを作成しました。</p>
                    
                    <div style="background: #eef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #444;">ユーザー情報</h3>
                        <p><strong>名前:</strong> ${userName}</p>
                        <p><strong>メール:</strong> ${userEmail}</p>
                    </div>

                    <p style="font-size: 0.8rem; color: #666;">管理画面のユーザー一覧で詳細を確認できます。</p>
                </div>
            `
        });
        console.log(`[Email] Admin new user notification sent to ${ADMIN_EMAIL}`);
    } catch (error) {
        console.error('[Email] Failed to send admin new user notification:', error);
    }
}
