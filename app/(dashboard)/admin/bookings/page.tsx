import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import BookingsManager from '@/components/admin/BookingsManager';

export default async function AdminBookingsPage() {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    const bookings = await prisma.booking.findMany({
        include: {
            user: {
                include: {
                    profile: true
                }
            },
            event: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>予約管理</h1>
            <BookingsManager initialBookings={bookings} />
            <a href="/admin" style={{ display: 'block', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                ダッシュボードに戻る
            </a>
        </div>
    );
}
