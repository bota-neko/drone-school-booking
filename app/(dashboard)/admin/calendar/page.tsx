import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { AdminCalendar } from '@/components/admin/AdminCalendar';

export const metadata = {
    title: 'カレンダー管理 | 管理画面',
};

export default async function AdminCalendarPage() {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>予約カレンダー管理</h1>
            <p style={{ marginBottom: '2rem', color: '#666' }}>
                すべてのイベントの確認・編集・削除が行えます。
            </p>
            <AdminCalendar />
        </div>
    );
}
