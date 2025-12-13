'use client';

import { useState } from 'react';
import { deleteUser } from '@/app/actions/admin';
import Link from 'next/link';

type User = {
    id: string;
    email: string;
    createdAt: Date;
    profile: {
        fullName: string;
    } | null;
    _count: {
        bookings: number;
    };
};

export function UserList({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (userId: string) => {
        if (!confirm('本当にこのユーザーを削除しますか？\n（関連するすべての予約データも削除されます）')) {
            return;
        }

        setIsLoading(true);
        try {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            alert('ユーザーを削除しました。');
        } catch (error) {
            console.error(error);
            alert('削除に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#555' }}>名前</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#555' }}>メールアドレス</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#555' }}>登録日</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#555' }}>予約数</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#555' }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px 16px' }}>{user.profile?.fullName || '未設定'}</td>
                            <td style={{ padding: '12px 16px', color: '#666' }}>{user.email}</td>
                            <td style={{ padding: '12px 16px', color: '#888' }}>
                                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <span style={{
                                    background: '#f0f0f0',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500'
                                }}>
                                    {user._count.bookings}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="btn"
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            fontSize: '0.8rem',
                                            textDecoration: 'none',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    >
                                        詳細
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => handleDelete(user.id)}
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                            padding: '0.25rem 0.5rem',
                                            fontSize: '0.8rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        削除
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                ユーザーが見つかりません。
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
