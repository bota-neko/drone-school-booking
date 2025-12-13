'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmailAction } from '@/app/actions/verify';
import Link from 'next/link';

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('トークンが見つかりません。');
            return;
        }

        const verify = async () => {
            const result = await verifyEmailAction(token);
            if (result.success) {
                setStatus('success');
                setMessage(result.message || '認証完了');
                // Optional: Redirect after few seconds
                setTimeout(() => router.push('/my-page'), 3000);
            } else {
                setStatus('error');
                setMessage(result.message || '認証エラー');
            }
        };

        verify();
    }, [token, router]);

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>メールアドレス認証</h1>

            {status === 'loading' && (
                <div>
                    <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p>認証中...</p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ color: '#16a34a' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>✅ {message}</p>
                    <p>3秒後にマイページへ移動します。</p>
                    <Link href="/my-page" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                        マイページへ
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div style={{ color: '#dc2626' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>❌ {message}</p>
                    <p>有効期限切れか、すでに認証済みの可能性があります。</p>
                    <Link href="/" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>
                        トップへ戻る
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
