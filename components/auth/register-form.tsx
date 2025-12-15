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
        <form action={action} className="card" style={{ maxWidth: '600px', margin: '2rem auto', boxShadow: 'var(--shadow-lg)', background: '#fff' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>アカウント作成</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    必要な情報を入力して登録を完了してください
                </p>
            </div>

            {/* Basic Info Section */}
            <div className="form-section">
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    基本情報
                </h3>

                <div className="form-group">
                    <label htmlFor="fullName" className="label">お名前 (フルネーム) <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                    <input name="fullName" id="fullName" className="input" placeholder="例: 山田 太郎" required />
                    {state?.errors?.fullName && <p className="error-message">{state.errors.fullName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="label">メールアドレス <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                    <input name="email" id="email" type="email" className="input" placeholder="例: tarou@example.com" required />
                    {state?.errors?.email && <p className="error-message">{state.errors.email}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="label">パスワード (6文字以上) <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                    <input name="password" id="password" type="password" className="input" placeholder="••••••••" required minLength={6} />
                    {state?.errors?.password && <p className="error-message">{state.errors.password}</p>}
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="form-section" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    詳細情報
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem' }}>
                    <div className="form-group">
                        <label htmlFor="phone" className="label">電話番号 <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                        <input id="phone" name="phone" type="tel" className="input" placeholder="例: 090-1234-5678" required />
                        {state?.errors?.phone && <p className="error-message">{state.errors.phone}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="age" className="label">年齢 <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                        <input id="age" name="age" type="number" min="18" className="input" placeholder="25" required />
                        {state?.errors?.age && <p className="error-message">{state.errors.age}</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address" className="label">住所 <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                    <input id="address" name="address" type="text" className="input" placeholder="例: 東京都渋谷区..." required />
                    {state?.errors?.address && <p className="error-message">{state.errors.address}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="emergencyContact" className="label">緊急連絡先 (氏名・電話番号) <span style={{ color: 'red', fontSize: '0.8em' }}>*</span></label>
                    <input id="emergencyContact" name="emergencyContact" type="text" className="input" placeholder="例: 父・東京太郎・090-XXXX-XXXX" required />
                    {state?.errors?.emergencyContact && <p className="error-message">{state.errors.emergencyContact}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="droneHistory" className="label">ドローン経験・資格 (任意)</label>
                    <textarea
                        id="droneHistory"
                        name="droneHistory"
                        className="input"
                        placeholder="例: 経験なし、DJI Mini 2所有、二等資格あり など"
                        rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                    ></textarea>
                </div>
            </div>

            {/* Terms Section */}
            <div className="form-section" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    規約の確認
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" name="termsAccepted" required style={{ width: '1.2em', height: '1.2em', accentColor: 'var(--accent-primary)' }} />
                        <span><a href="/terms" target="_blank" style={{ textDecoration: 'underline', fontWeight: 500 }}>利用規約</a>に同意する</span>
                    </label>
                    {state?.errors?.termsAccepted && <p className="error-message">{state.errors.termsAccepted}</p>}

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" name="privacyAccepted" required style={{ width: '1.2em', height: '1.2em', accentColor: 'var(--accent-primary)' }} />
                        <span><a href="/privacy" target="_blank" style={{ textDecoration: 'underline', fontWeight: 500 }}>個人情報保護方針</a>に同意する</span>
                    </label>
                    {state?.errors?.privacyAccepted && <p className="error-message">{state.errors.privacyAccepted}</p>}

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" name="riskAccepted" required style={{ width: '1.2em', height: '1.2em', accentColor: 'var(--accent-primary)' }} />
                        <span><a href="/risks" target="_blank" style={{ textDecoration: 'underline', fontWeight: 500 }}>リスク説明</a>を読み、同意する</span>
                    </label>
                    {state?.errors?.riskAccepted && <p className="error-message">{state.errors.riskAccepted}</p>}
                </div>
            </div>

            {state?.message && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                    {state.message}
                </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}>
                {pending ? '登録処理中...' : 'アカウントを作成する'}
            </button>

            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                すでにアカウントをお持ちですか？ <a href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textDecoration: 'underline', textUnderlineOffset: '4px' }}>ログイン</a>
            </p>
        </form>
    );
}
