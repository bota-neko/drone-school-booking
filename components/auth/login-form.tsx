'use client';

import { useActionState, useEffect } from 'react';
import { login, AuthState } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';

const initialState: AuthState = {};

export function LoginForm() {
    const [state, action, pending] = useActionState(login, initialState);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    useEffect(() => {
        if (state?.success && state.redirectUrl) {
            if (callbackUrl) {
                router.push(callbackUrl);
            } else {
                router.push(state.redirectUrl);
            }
            router.refresh();
        }
    }, [state, router, callbackUrl]);

    return (
        <form action={action} className="card auth-card">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>おかえりなさい</h2>

            <div className="form-group">
                <label htmlFor="email" className="label">メールアドレス</label>
                <input name="email" id="email" type="email" className="input" placeholder="例: tarou@example.com" />
                {state?.errors?.email && <p className="error-message">{state.errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="password" className="label">パスワード</label>
                <input name="password" id="password" type="password" className="input" placeholder="••••••••" />
                {state?.errors?.password && <p className="error-message">{state.errors.password}</p>}
            </div>

            {state?.message && <p className="error-message" style={{ marginBottom: '1rem' }}>{state.message}</p>}

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? 'ログイン中...' : 'ログイン'}
            </button>

            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                アカウントをお持ちでないですか？ <a href="/register" style={{ color: 'var(--accent-primary)' }}>新規登録</a>
            </p>
        </form>
    );
}
