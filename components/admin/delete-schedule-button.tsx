'use client';

import { useState } from 'react';
import { deleteAllEvents } from '@/app/actions/admin';

export function DeleteScheduleButton() {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        if (!confirm('本当に全ての予約枠（イベント）を削除しますか？\nこの操作は取り消せません。\n（※すでに予約が入っているイベントも削除されます）')) {
            return;
        }

        if (!confirm('最終確認：本当に全て削除してよろしいですか？')) {
            return;
        }

        setIsPending(true);
        try {
            const result = await deleteAllEvents();
            if (result.success) {
                alert(result.message);
            } else {
                alert('エラーが発生しました: ' + result.message);
            }
        } catch (e) {
            alert('予期せぬエラーが発生しました');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #fee2e2', borderRadius: '8px', background: '#fef2f2' }}>
            <h3 style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '0.5rem' }}>予約枠の一括削除</h3>
            <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '1rem' }}>
                カレンダーに登録された全てのイベント（セミナー・自由練習）を削除します。<br />
                テストデータをリセットしたい場合に使用してください。
            </p>
            <button
                onClick={handleDelete}
                disabled={isPending}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: isPending ? '#ccc' : '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: isPending ? 'not-allowed' : 'pointer'
                }}
            >
                {isPending ? '削除中...' : '全ての予約枠を削除する'}
            </button>
        </div>
    );
}
