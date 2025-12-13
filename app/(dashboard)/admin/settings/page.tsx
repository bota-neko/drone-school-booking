import { getSystemConfig } from '@/app/actions/settings';
import { SettingsForm } from '@/components/admin/settings-form';
import { DeleteScheduleButton } from '@/components/admin/delete-schedule-button';

export default async function AdminSettingsPage() {
    const config = await getSystemConfig();

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 0' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>サイト設定</h1>

            <div className="card">
                <SettingsForm initialConfig={config} />
            </div>

            <DeleteScheduleButton />
        </div>
    );
}
