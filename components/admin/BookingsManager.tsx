'use client';

import { useState } from 'react';
import { AdminCalendar } from '@/components/admin/AdminCalendar';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function BookingsManager({ initialBookings }: { initialBookings: any[] }) {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setViewMode('list')}
                    className="btn"
                    style={{
                        background: viewMode === 'list' ? 'var(--text-primary)' : 'var(--bg-secondary)',
                        color: viewMode === 'list' ? 'var(--bg-primary)' : 'var(--text-primary)'
                    }}
                >
                    リスト表示
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className="btn"
                    style={{
                        background: viewMode === 'calendar' ? 'var(--text-primary)' : 'var(--bg-secondary)',
                        color: viewMode === 'calendar' ? 'var(--bg-primary)' : 'var(--text-primary)'
                    }}
                >
                    カレンダー表示
                </button>
            </div>

            {viewMode === 'list' ? (
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>予約日時</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>イベント</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>開催日時</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>予約者</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ステータス</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialBookings.map(booking => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>{format(new Date(booking.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}</td>
                                        <td style={{ padding: '0.75rem' }}>{booking.event.title}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            {format(new Date(booking.event.startTime), 'yyyy/MM/dd HH:mm', { locale: ja })}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div>{booking.user.profile?.fullName || 'No Name'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.user.email}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span className="badge" style={{
                                                background: booking.status === 'CONFIRMED' ? 'var(--status-success)' : 'var(--text-muted)',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem'
                                            }}>
                                                {booking.status === 'CONFIRMED' ? '確定' : booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <AdminCalendar />
            )}
        </div>
    );
}
