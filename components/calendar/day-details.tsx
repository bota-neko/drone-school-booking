'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EventWithCount } from '@/app/actions/events';

export function DayDetails({ date, events }: { date: Date, events: EventWithCount[] }) {

    return (
        <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {format(date, 'yyyy年 MMMM d日 (EEEE)', { locale: ja })}
            </h3>

            {events.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>この日の予定はありません。</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {events.map(event => {
                        const bookedCount = event._count?.bookings || 0;
                        const isFull = bookedCount >= event.maxAttendees;

                        return (
                            <div key={event.id} style={{
                                padding: '1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'var(--bg-tertiary)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{event.title}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {format(new Date(event.startTime), 'HH:mm', { locale: ja })} - {format(new Date(event.endTime), 'HH:mm', { locale: ja })}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--accent-primary)' }}>
                                        {event.type === 'SEMINAR' ? '初心者向けセミナー' : '自由練習'}
                                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-primary)' }}>
                                            (予約: {bookedCount} / 定員: {event.maxAttendees})
                                        </span>
                                    </div>
                                </div>
                                {isFull ? (
                                    <button disabled className="btn" style={{ width: 'auto', background: 'var(--text-muted)', cursor: 'not-allowed', color: 'white' }}>
                                        満席
                                    </button>
                                ) : (
                                    <Link href={`/bookings/confirm?eventId=${event.id}`} className="btn btn-primary" style={{ width: 'auto', textDecoration: 'none' }}>
                                        予約する
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
