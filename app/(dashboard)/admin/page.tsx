import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
    const session = await verifySession();

    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>管理者ダッシュボード</h1>

            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>イベント管理</h2>
                <p style={{ marginBottom: '1.5rem' }}>新しいイベントの作成や既存のイベントの管理ができます。</p>
                <a href="/admin/events/new" className="btn btn-primary" style={{ width: 'auto', display: 'inline-block', textDecoration: 'none' }}>
                    + イベントを作成
                </a>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>予約管理</h2>
                <p style={{ marginBottom: '1.5rem' }}>現在の予約状況を確認できます。</p>
                <a href="/admin/bookings" className="btn" style={{ width: 'auto', display: 'inline-block', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    予約一覧を見る
                </a>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>クイック設定</h2>
                <p style={{ marginBottom: '1.5rem' }}>自由練習の枠をカレンダーから簡単に作成できます。</p>
                <a href="/admin/free-practice" className="btn" style={{ width: 'auto', display: 'inline-block', textDecoration: 'none', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                    自由練習枠を設定
                </a>
            </div>
        </div>
    );
}
