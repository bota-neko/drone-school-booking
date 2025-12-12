import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import TimeSlotEditor from '@/components/admin/TimeSlotEditor';

export default async function FreePracticePage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    const { date: dateStr } = await searchParams;
    const date = dateStr ? new Date(dateStr) : new Date();

    const events = await prisma.event.findMany({
        where: {
            startTime: {
                gte: startOfDay(date),
                lt: endOfDay(date)
            }
        }
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>自由練習枠のクイック設定</h1>

            <div className="card">
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <a href={`?date=${format(new Date(date.getTime() - 86400000), 'yyyy-MM-dd')}`} className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                        &lt; 前日
                    </a>

                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                        {format(date, 'yyyy年 MMMM d日 (EEEE)', { locale: ja })}
                    </h2>

                    <a href={`?date=${format(new Date(date.getTime() + 86400000), 'yyyy-MM-dd')}`} className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                        翌日 &gt;
                    </a>
                </div>

                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                    時間枠をクリックして「自由練習」を設定してください
                </h3>

                <TimeSlotEditor date={date} existingEvents={events} />
            </div>

            <a href="/admin" style={{ display: 'block', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                ダッシュボードに戻る
            </a>
        </div>
    );
}
