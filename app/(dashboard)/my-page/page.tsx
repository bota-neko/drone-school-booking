import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { logout } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BookingCard } from '@/components/bookings/booking-card';

export default async function MyPage() {
    const session = await verifySession();

    if (!session?.isAuth) {
        redirect('/login');
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: session.userId },
        include: { event: true },
        orderBy: { event: { startTime: 'asc' } }
    });

    // Define the logout server action
    const logout = async () => {
        'use server';
        const { deleteSession } = await import('@/lib/session');
        await deleteSession();
        redirect('/login');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>マイページ</h1>
            <p style={{ marginBottom: '2rem' }}>おかえりなさい！</p>

            <div style={{ marginBottom: '2rem' }}>
                <a href="/calendar" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto' }}>
                    カレンダーから予約する
                </a>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>予約済みイベント</h2>
                {bookings.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>予約済みのイベントはありません。</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {bookings.map(booking => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                )}
            </div>

            <form action={logout}>
                <button type="submit" className="btn" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    ログアウト
                </button>
            </form>
        </div >
    );
}
