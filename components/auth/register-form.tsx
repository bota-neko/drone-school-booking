'use client';

import { useActionState, useEffect } from 'react';
import { signup, AuthState } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';

const initialState: AuthState = {};

export function RegisterForm() {
    const [state, action, pending] = useActionState(signup, initialState);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    useEffect(() => {
        if (state?.success) {
            if (callbackUrl) {
                router.push(callbackUrl);
            } else {
                router.push('/my-page');
            }
            router.refresh();
        }
    }, [state, router, callbackUrl]);

    return (
        <form action={action} className="card auth-card">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>アカウント作成</h2>

            <div className="form-group">
                <label htmlFor="fullName" className="label">お名前 (フルネーム)</label>
                <input name="fullName" id="fullName" className="input" placeholder="山田 太郎" />
                {state?.errors?.fullName && <p className="error-message">{state.errors.fullName}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="email" className="label">メールアドレス</label>
                <input name="email" id="email" type="email" className="input" placeholder="tarou@example.com" />
                {state?.errors?.email && <p className="error-message">{state.errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="password" className="label">パスワード</label>
                <input name="password" id="password" type="password" className="input" placeholder="••••••••" />
                {state?.errors?.password && <p className="error-text">{state.errors.password}</p>}
            </div>

            <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #eee' }} />

            <div className="form-group">
                <label htmlFor="phone">電話番号</label>
                <input id="phone" name="phone" type="tel" placeholder="090-1234-5678" required />
                {state?.errors?.phone && <p className="error-text">{state.errors.phone}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="age">年齢</label>
                <input id="age" name="age" type="number" min="10" placeholder="25" required style={{ width: '80px' }} />
                {state?.errors?.age && <p className="error-text">{state.errors.age}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="address">住所</label>
                <input id="address" name="address" type="text" placeholder="東京都渋谷区..." required />
                {state?.errors?.address && <p className="error-text">{state.errors.address}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="droneHistory">ドローン経験（歴・保有資格など）</label>
                <textarea id="droneHistory" name="droneHistory" placeholder="経験なし、DJI Mini 2所有、二等資格あり など" rows={3} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="emergencyContact">緊急連絡先（氏名・続柄・電話番号）</label>
                <input id="emergencyContact" name="emergencyContact" type="text" placeholder="父・東京太郎・090-XXXX-XXXX" required />
                {state?.errors?.emergencyContact && <p className="error-text">{state.errors.emergencyContact}</p>}
            </div>

            <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #eee' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="termsAccepted" required />
                    <span><a href="/terms" target="_blank" style={{ textDecoration: 'underline' }}>利用規約</a>に同意する</span>
                </label>
                {state?.errors?.termsAccepted && <p className="error-text">{state.errors.termsAccepted}</p>}

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="privacyAccepted" required />
                    <span><a href="/privacy" target="_blank" style={{ textDecoration: 'underline' }}>個人情報保護方針</a>に同意する</span>
                </label>
                {state?.errors?.privacyAccepted && <p className="error-text">{state.errors.privacyAccepted}</p>}

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="riskAccepted" required />
                    <span><a href="/risks" target="_blank" style={{ textDecoration: 'underline' }}>リスク説明</a>を読み、同意する</span>
                </label>
                {state?.errors?.riskAccepted && <p className="error-text">{state.errors.riskAccepted}</p>}
            </div>

            {state?.message && <p className="error-message" style={{ marginBottom: '1rem' }}>{state.message}</p>}

            <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: '2rem' }}>
                {pending ? '登録中...' : '登録する'}
            </button>

            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                すでにアカウントをお持ちですか？ <a href="/login" style={{ color: 'var(--accent-primary)' }}>ログイン</a>
            </p>
        </form>
    );
}
