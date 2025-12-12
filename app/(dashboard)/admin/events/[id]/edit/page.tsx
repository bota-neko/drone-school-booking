
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { updateEvent } from '@/app/actions/admin';
import { revalidatePath } from 'next/cache';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: { id }
    });

    if (!event) {
        return <div>Event not found</div>;
    }

    async function handleUpdate(formData: FormData) {
        'use server'
        await updateEvent(id, formData);
        redirect('/admin');
    }

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>イベント編集</h1>

            <form action={handleUpdate} className="card">
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>イベント名</label>
                    <input
                        name="title"
                        defaultValue={event.title}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>場所</label>
                    <input
                        name="location"
                        defaultValue={event.location || ''}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>定員</label>
                        <input
                            name="maxAttendees"
                            type="number"
                            min="1"
                            defaultValue={event.maxAttendees}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>価格 (円)</label>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            defaultValue={event.price}
                            required
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <a href="/admin" className="btn" style={{ textDecoration: 'none', border: '1px solid #ccc', flex: 1, textAlign: 'center' }}>キャンセル</a>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>保存する</button>
                </div>
            </form>
        </div>
    );
}
