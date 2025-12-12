'use client';

import { useState } from 'react';
import { bookEvent } from '@/app/actions/booking';
import { useRouter } from 'next/navigation';

export function BookingConfirmForm({ eventId }: { eventId: string }) {
    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setErrorMessage('');
        try {
            const result = await bookEvent(eventId);

            console.log('Booking result:', result);
            if (result.success) {
                console.log('Redirecting to /my-page');
                router.push('/my-page');
                router.refresh();
            } else {
                console.error('Booking failed with message:', result.message);
                setErrorMessage(result.message || '予約に失敗しました。');
                if (result.message && result.message.includes('full')) router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            setErrorMessage('予期せぬエラーが発生しました。');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    上記の内容で予約を確定しますか？
                </p>
                {errorMessage && (
                    <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', border: '1px solid #fecaca' }}>
                        {errorMessage}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a href="/calendar" className="btn" style={{ background: 'var(--bg-secondary)', textDecoration: 'none', color: 'var(--text-primary)', pointerEvents: isPending ? 'none' : 'auto' }}>
                    キャンセル
                </a>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? '予約処理中...' : '予約を確定する'}
                </button>
            </div>
        </form>
    );
}
