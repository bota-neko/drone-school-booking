
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getUsers } from '@/app/actions/admin';
import { UserList } from '@/components/admin/UserList';

export const metadata = {
    title: 'ユーザー管理 | 管理画面',
};

export default async function AdminUsersPage() {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        redirect('/login');
    }

    const users = await getUsers();

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ユーザー管理</h1>
                <p style={{ color: '#666' }}>一般ユーザーの一覧と管理を行います。</p>
            </div>

            <UserList initialUsers={users} />
        </div>
    );
}
