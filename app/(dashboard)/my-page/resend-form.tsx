'use client';

import { useActionState } from 'react';
import { resendVerificationEmail } from '@/app/actions/verify';

export function ResendVerificationForm() {
    // Basic form action wrapper
    const handleSubmit = async (formData: FormData) => {
        // We don't really need form data or action state complexity for a simple trigger
        // but let's stick to standard if possible, or just an async handler.
        if (!confirm('認証メールを再送しますか？')) return;

        const res = await resendVerificationEmail();
        if (res.success) {
            alert(res.message);
        } else {
            alert(res.message);
        }
    };

    return (
        <form action={handleSubmit}>
            <button
                type="submit"
                style={{
                    background: 'transparent',
                    border: '1px solid #856404',
                    color: '#856404',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    borderRadius: '3px'
                }}
            >
                認証メールを再送する
            </button>
        </form>
    );
}
