'use client';

import { useState } from 'react';
import { createTestUsers } from '@/app/actions/admin';

export function UserSeederButton() {
    const [isPending, setIsPending] = useState(false);

    const handleCreate = async () => {
        if (!confirm('テストユーザー(test02〜test05)を追加しますか？\nパスワードは "password123" に設定されます。')) {
            return;
        }

        setIsPending(true);
        try {
            const result = await createTestUsers();
            alert(result.message);
        } catch (e) {
            alert('予期せぬエラーが発生しました');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', border: '1px solid #bfdbfe', borderRadius: '8px', background: '#eff6ff' }}>
            <h3 style={{ color: '#1e40af', fontWeight: 'bold', marginBottom: '0.5rem' }}>テストユーザー作成</h3>
            <p style={{ fontSize: '0.9rem', color: '#1e3a8a', marginBottom: '1rem' }}>
                test02@example.com 〜 test05@example.com の4アカウントを作成します。<br />
                予約枠の埋まり具合テストなどに便利です。
            </p>
            <button
                onClick={handleCreate}
                disabled={isPending}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: isPending ? '#ccc' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: isPending ? 'not-allowed' : 'pointer'
                }}
            >
                {isPending ? '作成中...' : 'テストユーザーを追加する'}
            </button>
        </div>
    );
}
