'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getAdminEvents } from '@/app/actions/events';
import { deleteEventAction } from '@/app/actions/admin';
import { Modal } from '@/components/ui/Modal';

export function AdminCalendar() {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Month Logic
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ja });
    const endDate = endOfWeek(monthEnd, { locale: ja });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            const data = await getAdminEvents(startDate, endDate);
            setEvents(data);
            setLoading(false);
        }
        fetch();
    }, [viewDate]);

    const nextMonth = () => setViewDate(addMonths(viewDate, 1));
    const prevMonth = () => setViewDate(subMonths(viewDate, 1));

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm('本当にこのイベントを削除しますか？\n（予約が含まれる場合、それらも削除されます）')) {
            return;
        }

        try {
            await deleteEventAction(eventId);
            // Quick refresh
            const data = await getAdminEvents(startDate, endDate);
            setEvents(data);
            setSelectedDate(null); // Close modal
            alert('イベントを削除しました。');
        } catch (error) {
            console.error(error);
            alert('削除に失敗しました。');
        }
    };

    const selectedEvents = selectedDate
        ? events.filter(e => isSameDay(new Date(e.startTime), selectedDate))
        : [];

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{format(viewDate, 'yyyy年 MMMM', { locale: ja })} (管理者)</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} className="btn" style={{ border: '1px solid var(--border-color)' }}>前月</button>
                    <button onClick={nextMonth} className="btn" style={{ border: '1px solid var(--border-color)' }}>次月</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '1px' }}>
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', textAlign: 'center', fontWeight: 'bold' }}>
                        {day}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)' }}>
                {days.map(day => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), day));
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setSelectedDate(day)}
                            style={{
                                minHeight: '100px',
                                background: isSelected ? 'var(--bg-tertiary)' : (isSameMonth(day, monthStart) ? 'var(--bg-primary)' : 'var(--bg-secondary)'),
                                padding: '0.5rem',
                                opacity: isSameMonth(day, monthStart) ? 1 : 0.5,
                                cursor: 'pointer',
                                border: isSelected ? '2px solid var(--accent-primary)' : 'none'
                            }}
                        >
                            <div style={{ textAlign: 'right', marginBottom: '0.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {format(day, 'd')}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {dayEvents.map(event => (
                                    <div key={event.id} style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 4px',
                                        borderRadius: '2px',
                                        background: event.bookings.length > 0 ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                        color: event.bookings.length > 0 ? 'white' : 'var(--text-primary)',
                                        border: event.bookings.length === 0 ? '1px solid var(--border-color)' : 'none',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {format(new Date(event.startTime), 'HH:mm')} {event.title} ({event._count.bookings}/{event.maxAttendees})
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} title={selectedDate ? format(selectedDate, 'yyyy年 MMMM d日', { locale: ja }) : ''}>
                {selectedEvents.length === 0 ? (
                    <p>この日のイベントはありません。</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedEvents.map(event => (
                            <div key={event.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{event.title}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                                </div>
                                <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                                    予約者 ({event.bookings.length}/{event.maxAttendees})
                                </div>
                                {event.bookings.length === 0 ? (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>予約はいません。</p>
                                ) : (
                                    <ul style={{ margin: '0.5rem 0 0 1.5rem', fontSize: '0.9rem' }}>
                                        {event.bookings.map((b: any) => (
                                            <li key={b.id}>
                                                {b.user.profile?.fullName || 'No Name'} ({b.user.email})
                                                <span className="badge" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>{b.status}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <a href={`/admin/events/${event.id}/edit`} className="btn" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '4px 12px', background: '#f0f0f0', border: '1px solid #ddd', color: '#333' }}>編集</a>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        style={{
                                            background: '#fff0f0', color: '#d32f2f', border: '1px solid #ffcdd2',
                                            borderRadius: '4px', padding: '4px 12px', fontSize: '0.8rem', cursor: 'pointer'
                                        }}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal >
        </div >
    );
}
