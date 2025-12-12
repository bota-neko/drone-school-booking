import { createEvent } from '@/app/actions/admin';

export default function NewEventPage() {
    return (
        <div className="container center" style={{ marginTop: '2rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>新規イベント作成</h1>

                <form action={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className="form-group">
                        <label className="label">イベントタイプ</label>
                        <select name="type" className="input">
                            <option value="SEMINAR">セミナー</option>
                            <option value="FREE_PRACTICE">自由練習</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label">タイトル</label>
                        <input name="title" className="input" placeholder="例: 初心者講習会" required />
                    </div>

                    <div className="form-group">
                        <label className="label">日付</label>
                        <input name="date" type="date" className="input" required />
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label className="label">開始時間</label>
                            <input name="startTime" type="time" className="input" required />
                        </div>
                        <div className="form-group">
                            <label className="label">終了時間</label>
                            <input name="endTime" type="time" className="input" required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label className="label">定員</label>
                            <input name="maxAttendees" type="number" className="input" defaultValue={1} min={1} />
                        </div>
                        <div className="form-group">
                            <label className="label">料金 (円)</label>
                            <input name="price" type="number" className="input" defaultValue={0} min={0} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">繰り返し設定 (セミナーのみ)</label>
                        <select name="recurrence" className="input">
                            <option value="NONE">なし</option>
                            <option value="WEEKLY">毎週</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        イベントを作成
                    </button>

                    <a href="/admin" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        戻る
                    </a>
                </form>
            </div>
        </div>
    );
}
