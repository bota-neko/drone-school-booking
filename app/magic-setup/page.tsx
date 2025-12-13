'use client';

// Force this page to be dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';

import { useActionState } from 'react'; // Stable hook in recent React/Next
import { promoteUserToAdmin } from '@/app/actions/admin-setup';

export default function AdminSetupPage() {
    console.log('Magic Setup Page v2 rendering...');

    // Standard setup for useActionState (or useFormState in older versions)
    // If useActionState is not available, we can fallback to simple form submission or useState transition.
    // For safety in this environment, I'll use a simple client wrapper or just standard form submission.

    // Actually, let's keep it super simple to avoid hook version issues.
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Admin Setup Tool v2</h1>
            <p>Use this tool to force-promote a user to Admin.</p>

            <form action={async (formData) => {
                const result = await promoteUserToAdmin(formData);
                alert(result.message);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>User Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Secret Key</label>
                    <input
                        name="secret"
                        type="text"
                        required
                        placeholder="Key..."
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '1rem',
                        background: 'black',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Promote to Admin
                </button>
            </form>
        </div>
    );
}
