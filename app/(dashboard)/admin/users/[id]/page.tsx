import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            profile: true,
            bookings: {
                include: {
                    event: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/users" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                    &larr; ユーザー一覧に戻る
                </Link>
            </div>

            <div className="card">
                <h1 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    ユーザー詳細: {user.profile?.fullName || '名前なし'}
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>基本情報</h3>
                        <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '0.5rem' }}>
                            <dt style={{ fontWeight: 'bold' }}>ID</dt>
                            <dd>{user.id}</dd>

                            <dt style={{ fontWeight: 'bold' }}>メールアドレス</dt>
                            <dd>{user.email}</dd>

                            <dt style={{ fontWeight: 'bold' }}>権限</dt>
                            <dd>{user.role}</dd>

                            <dt style={{ fontWeight: 'bold' }}>登録日</dt>
                            <dd>{new Date(user.createdAt).toLocaleDateString('ja-JP')}</dd>
                        </dl>
                    </div>

                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>プロフィール詳細</h3>
                        {user.profile ? (
                            <dl style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '0.5rem' }}>
                                <dt style={{ fontWeight: 'bold' }}>電話番号</dt>
                                <dd>{user.profile.phone || '-'}</dd>

                                <dt style={{ fontWeight: 'bold' }}>年齢</dt>
                                <dd>{user.profile.age ? `${user.profile.age}歳` : '-'}</dd>

                                <dt style={{ fontWeight: 'bold' }}>住所</dt>
                                <dd>{user.profile.address || '-'}</dd>

                                <dt style={{ fontWeight: 'bold' }}>ドローン経験</dt>
                                <dd style={{ whiteSpace: 'pre-wrap' }}>{user.profile.droneHistory || '-'}</dd>

                                <dt style={{ fontWeight: 'bold' }}>緊急連絡先</dt>
                                <dd>{user.profile.emergencyContact || '-'}</dd>
                            </dl>
                        ) : (
                            <p>プロフィール情報がありません</p>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>同意状況</h3>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div>
                            <span style={{ marginRight: '0.5rem' }}>{user.profile?.termsAccepted ? '✅' : '❌'}</span>
                            利用規約
                        </div>
                        <div>
                            <span style={{ marginRight: '0.5rem' }}>{user.profile?.privacyAccepted ? '✅' : '❌'}</span>
                            個人情報保護方針
                        </div>
                        <div>
                            <span style={{ marginRight: '0.5rem' }}>{user.profile?.riskAccepted ? '✅' : '❌'}</span>
                            リスク説明
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>予約履歴</h3>
                {user.bookings.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '0.5rem' }}>日付</th>
                                <th style={{ padding: '0.5rem' }}>イベント</th>
                                <th style={{ padding: '0.5rem' }}>ステータス</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.bookings.map(booking => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        {new Date(booking.event.startTime).toLocaleDateString('ja-JP')}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>{booking.event.title}</td>
                                    <td style={{ padding: '0.5rem' }}>{booking.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>予約履歴はありません</p>
                )}
            </div>
        </div>
    );
}
