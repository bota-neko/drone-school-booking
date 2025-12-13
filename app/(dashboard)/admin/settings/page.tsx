import { getSystemConfig } from '@/app/actions/settings';
import { SettingsForm } from '@/components/admin/settings-form';
import { DeleteScheduleButton } from '@/components/admin/delete-schedule-button';
import { UserSeederButton } from '@/components/admin/user-seeder-button';
import { ChangeEmailForm } from '@/components/admin/change-email-form';

export default async function AdminSettingsPage() {
    const config = await getSystemConfig();

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>サイト設定</h1>

            <div className="card">
                <SettingsForm initialConfig={config} />
            </div>

            <ChangeEmailForm />

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <DeleteScheduleButton />
                <UserSeederButton />
            </div>
        </div>
    );
}
