'use client';

import { useActionState } from 'react';
import { updateSystemConfig } from '@/app/actions/settings';

type Config = {
    siteTitle: string;
    logoUrl: string | null;
};

export function SettingsForm({ initialConfig }: { initialConfig: Config }) {
    const [state, action, pending] = useActionState(updateSystemConfig, {});

    return (
        <form action={action}>
            <div className="form-group">
                <label htmlFor="siteTitle" className="label">サイトタイトル</label>
                <input
                    name="siteTitle"
                    id="siteTitle"
                    className="input"
                    defaultValue={initialConfig.siteTitle}
                    required
                />
                {state?.errors?.siteTitle && <p className="error-message">{state.errors.siteTitle}</p>}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    ブラウザのタブやヘッダーに表示されるタイトルです。
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="logoFile" className="label">ロゴ画像</label>

                {initialConfig.logoUrl && (
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={initialConfig.logoUrl} alt="Current Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>現在のロゴ</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>変更する場合は下から新しいファイルを選択してください</p>
                        </div>
                    </div>
                )}

                <input
                    type="file"
                    name="logoFile"
                    id="logoFile"
                    className="input"
                    accept="image/*"
                />

                {state?.errors?.logoFile && <p className="error-message">{state.errors.logoFile}</p>}
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    推奨: 透過PNG, 高さ40px以上
                </p>
            </div>

            {state?.message && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: state.success ? '#dcfce7' : '#fee2e2',
                    color: state.success ? '#166534' : '#991b1b',
                    marginBottom: '1.5rem'
                }}>
                    {state.message}
                </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? '保存中...' : '設定を保存'}
            </button>
        </form>
    );
}
