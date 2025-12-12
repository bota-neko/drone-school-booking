'use client';

import { logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = async () => {
        startTransition(async () => {
            await logout(); // This now needs to NOT redirect
            // Client-side redirect
            router.push('/login');
            router.refresh();
        });
    };

    // Icon definition copied/shared or simplified
    const LogOutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    );

    return (
        <button onClick={handleLogout} className="btn" disabled={isPending} style={{
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', gap: '4px',
            cursor: 'pointer'
        }}>
            <span className="nav-text" style={{ whiteSpace: 'nowrap' }}>{isPending ? '...' : 'ログアウト'}</span>
            <LogOutIcon />
        </button>
    );
}
