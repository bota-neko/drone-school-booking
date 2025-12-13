'use client';

import { useState } from 'react';
import { updateAdminEmail } from '@/app/actions/admin';

export function ChangeEmailForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`管理者のメールアドレスを「${email}」に変更しますか？\n変更後はこのアドレスでログインする必要があります。`)) return;

        setIsLoading(true);
        try {
            const res = await updateAdminEmail(email);
            if (res.success) {
                alert(res.message);
                setEmail('');
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert('エラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>管理者メールアドレス変更</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                テストなどのために、一時的に別のアドレスに変更する場合に使用します。<br />
                変更後は新しいアドレスでログインしてください。
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="新しいメールアドレス"
                    required
                    className="input"
                    style={{ flex: 1 }}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? '更新中...' : '変更する'}
                </button>
            </form>
        </div>
    );
}
