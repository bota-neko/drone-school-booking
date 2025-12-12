import { Calendar } from '@/components/calendar/Calendar';

export default function CalendarPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-outfit)', fontWeight: 700 }}>予約カレンダー</h1>
            <Calendar />
        </div>
    );
}
