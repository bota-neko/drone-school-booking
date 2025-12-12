import { Calendar } from '@/components/calendar/Calendar';

export default function Home() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Class Schedule</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          ご希望の日時を選択して予約してください。
        </p>
      </div>
      <Calendar />
    </div>
  );
}
