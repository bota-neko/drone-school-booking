import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';

import { BookingConfirmForm } from '@/components/bookings/booking-confirm-form';

export default async function BookingConfirmPage({
    searchParams,
}: {
    searchParams: Promise<{ eventId: string }>;
}) {
    const { eventId } = await searchParams;
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect(`/login?callbackUrl=/bookings/confirm?eventId=${eventId}`);
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) {
        return <div className="container">イベントが見つかりません</div>;
    }

    return (
        <div className="container center" style={{ marginTop: '2rem' }}>
            <div className="card booking-card">
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>予約の確認</h1>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>イベント</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{event.title}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>日付</div>
                            <div>{format(event.startTime, 'yyyy年 MMMM d日 (EEEE)', { locale: ja })}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>時間</div>
                            <div>
                                {format(event.startTime, 'HH:mm', { locale: ja })} - {format(event.endTime, 'HH:mm', { locale: ja })}
                            </div>
                        </div>
                    </div>
                </div>

                <BookingConfirmForm eventId={eventId} />
            </div>
        </div>
    );
}
