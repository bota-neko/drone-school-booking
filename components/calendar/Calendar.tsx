'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getEvents, EventWithCount } from '@/app/actions/events';
import clsx from 'clsx';
// We'll use the type from the server action
import { DayDetails } from './day-details';
import { Modal } from '@/components/ui/Modal';

export function Calendar() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [viewDate, setViewDate] = useState(new Date());
    const [events, setEvents] = useState<EventWithCount[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState<'ALL' | 'SEMINAR' | 'FREE_PRACTICE'>('ALL');

    // Month View Logic (using viewDate)
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ja });
    const endDate = endOfWeek(monthEnd, { locale: ja });

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    useEffect(() => {
        async function fetchEvents() {
            setLoading(true);
            // Fetch a bit more than just the view to be safe/smooth
            const data = await getEvents(startDate, endDate);
            setEvents(data);
            setLoading(false);
        }
        fetchEvents();
    }, [viewDate]); // Re-fetch when month changes.

    const nextMonth = () => setViewDate(addMonths(viewDate, 1));
    const prevMonth = () => setViewDate(subMonths(viewDate, 1));

    // Filter events
    const filteredEvents = events.filter(event => {
        if (filterType === 'ALL') return true;
        return event.type === filterType;
    });

    return (
        <div className="card">
            {/* Event Type Legend */}
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '2px' }}></span>
                    <strong>セミナー:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>複数人での同時講義（実機での練習/講義含む）（3000円/90分）</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#52525b', borderRadius: '2px' }}></span>
                    <strong>自由練習:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>シミュレータや実機を使って自由に練習できる時間枠。（1500円/１時間）</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#d4d4d8', borderRadius: '2px' }}></span>
                    <strong>満席:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>予約受付終了</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f97316', borderRadius: '2px' }}></span>
                    <strong>予約済み:</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>自分が予約している枠</span>
                </div>
            </div>

            {/* Header: Month & Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>{format(viewDate, 'yyyy年 MMMM', { locale: ja })}</h2>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={prevMonth} className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.5rem 1rem' }}>前月</button>
                    <button onClick={nextMonth} className="btn" style={{ border: '1px solid var(--border-color)', padding: '0.5rem 1rem' }}>次月</button>
                </div>
            </div>

            {/* Filter Controls */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setFilterType('ALL')}
                    className={clsx('btn', filterType === 'ALL' ? 'btn-primary' : '')}
                    style={{ border: '1px solid var(--border-color)' }}
                >
                    すべて
                </button>
                <button
                    onClick={() => setFilterType('SEMINAR')}
                    className={clsx('btn', filterType === 'SEMINAR' ? 'btn-primary' : '')}
                    style={{ border: '1px solid var(--border-color)' }}
                >
                    セミナー
                </button>
                <button
                    onClick={() => setFilterType('FREE_PRACTICE')}
                    className={clsx('btn', filterType === 'FREE_PRACTICE' ? 'btn-primary' : '')}
                    style={{ border: '1px solid var(--border-color)' }}
                >
                    自由練習
                </button>
            </div>

            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)', marginBottom: '1px' }}>
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', textAlign: 'center', fontWeight: 'bold' }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)' }}>
                {days.map(day => {
                    const dayEvents = filteredEvents.filter(e => isSameDay(new Date(e.startTime), day));
                    const isSelected = currentDate ? isSameDay(day, currentDate) : false;
                    return (
                        <div
                            key={day.toString()}
                            onClick={() => setCurrentDate(day)}
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
                                        background: event.isBooked
                                            ? '#f97316'
                                            : ((event._count?.bookings || 0) >= event.maxAttendees
                                                ? '#d4d4d8'
                                                : (event.type === 'SEMINAR' ? 'var(--accent-primary)' : '#52525b')),
                                        color: event.isBooked || event.type === 'SEMINAR' || ((event._count?.bookings || 0) < event.maxAttendees && event.type === 'FREE_PRACTICE') ? 'white' : 'var(--text-primary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {format(new Date(event.startTime), 'HH:mm')} {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            {loading && <p style={{ textAlign: 'center', marginTop: '1rem' }}>読み込み中...</p>}

            <Modal isOpen={!!currentDate} onClose={() => setCurrentDate(null)}>
                <DayDetails date={currentDate || new Date()} events={filteredEvents.filter(e => isSameDay(new Date(e.startTime), currentDate || new Date()))} />
            </Modal>
        </div>
    );
}
