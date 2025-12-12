'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cancelBooking } from '@/app/actions/booking';

interface Event {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
}

interface Booking {
    id: string;
    status: string;
    event: Event;
}

export function BookingCard({ booking }: { booking: Booking }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');

    const handleCancelClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmCancel = async () => {
        setShowConfirm(false);
        setMessage('');

        startTransition(async () => {
            try {
                const result = await cancelBooking(booking.id);
                if (result.success) {
                    setMessage('キャンセルしました');
                    router.refresh();
                } else {
                    setMessage(result.message || 'エラーが発生しました');
                }
            } catch (e) {
                console.error(e);
                setMessage('予期せぬエラー');
            }
        });
    };

    const handleCancelAbort = () => {
        setShowConfirm(false);
    };

    return (
        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{booking.event.title}</div>
            <div style={{ marginTop: '0.25rem' }}>{format(new Date(booking.event.startTime), 'yyyy年 MMMM d日 (EEEE)', { locale: ja })}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {format(new Date(booking.event.startTime), 'HH:mm', { locale: ja })} - {format(new Date(booking.event.endTime), 'HH:mm', { locale: ja })}
            </div>
            {message && <div style={{ color: message.includes('エラー') ? 'red' : 'green', margin: '0.5rem 0' }}>{message}</div>}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <span className={`badge ${booking.status.toLowerCase()}`} style={{
                    background: booking.status === 'CONFIRMED' ? 'var(--status-success)' : 'var(--text-muted)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                }}>
                    {booking.status === 'CONFIRMED' ? '確定' : 'キャンセル済'}
                </span>

                {booking.status === 'CONFIRMED' && (
                    <div>
                        {showConfirm ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'red', whiteSpace: 'nowrap' }}>本当にキャンセルしますか？</span>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="btn"
                                    disabled={isPending}
                                    style={{ padding: '2px 8px', fontSize: '0.8rem', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    はい
                                </button>
                                <button
                                    onClick={handleCancelAbort}
                                    className="btn"
                                    style={{ padding: '2px 8px', fontSize: '0.8rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    いいえ
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleCancelClick}
                                className="btn"
                                disabled={isPending}
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '0.8rem',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    cursor: isPending ? 'not-allowed' : 'pointer',
                                    opacity: isPending ? 0.7 : 1,
                                    width: 'auto',
                                }}>
                                {isPending ? '処理中...' : 'キャンセル'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
