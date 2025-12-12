'use client';

import { useState } from 'react';
import { format, eachHourOfInterval, startOfDay, endOfDay, isSameHour } from 'date-fns';
import { ja } from 'date-fns/locale';
import { quickUpsertFreePractice, quickDeleteFreePractice } from '@/app/actions/admin';

interface Event {
    startTime: Date;
    endTime: Date;
    type: string;
    maxAttendees: number;
}

interface TimeSlotEditorProps {
    date: Date;
    existingEvents: Event[];
}

export default function TimeSlotEditor({ date, existingEvents }: TimeSlotEditorProps) {
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [maxAttendees, setMaxAttendees] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Generate slots from 10:00 to 22:00
    const start = startOfDay(date);
    start.setHours(10);
    const end = endOfDay(date);
    end.setHours(22);

    const slots = eachHourOfInterval({ start, end });
    slots.pop();

    const toggleSlot = (timeStr: string) => {
        if (selectedSlots.includes(timeStr)) {
            setSelectedSlots(prev => prev.filter(s => s !== timeStr));
        } else {
            setSelectedSlots(prev => [...prev, timeStr]);
        }
    };

    const handleSave = async () => {
        if (selectedSlots.length === 0) return;
        setIsSaving(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            await quickUpsertFreePractice(formattedDate, selectedSlots, maxAttendees);
            setSelectedSlots([]);
            // Optional: Show success
        } catch (error) {
            console.error(error);
            alert('Failed to update slots');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (selectedSlots.length === 0) return;
        if (!confirm('選択した枠を削除しますか？\n（予約が入っている場合も削除されます）')) return;

        setIsSaving(true);
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            await quickDeleteFreePractice(formattedDate, selectedSlots);
            setSelectedSlots([]);
        } catch (error) {
            console.error(error);
            alert('Failed to delete slots');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            {/* Control Panel */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 'bold' }}>定員 (各枠):</label>
                    <input
                        type="number"
                        min="1"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(parseInt(e.target.value) || 1)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', width: '80px', textAlign: 'center' }}
                    />
                </div>
            </div>

            {/* Slots Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                {slots.map(slot => {
                    const timeStr = format(slot, 'HH:mm');
                    // Find actual event object if busy
                    const existingEvent = existingEvents.find(e =>
                        (e.startTime <= slot && e.endTime > slot) ||
                        (isSameHour(e.startTime, slot))
                    );

                    const isBusy = !!existingEvent;
                    const isSelected = selectedSlots.includes(timeStr);

                    return (
                        <button
                            key={timeStr}
                            disabled={isSaving}
                            onClick={() => toggleSlot(timeStr)}
                            style={{
                                padding: '1rem',
                                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                background: isBusy ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'center',
                                position: 'relative'
                            }}
                        >
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{timeStr}</div>
                            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: isBusy ? 'var(--status-success)' : 'var(--text-muted)' }}>
                                {isBusy ? `設定済 (${existingEvent?.maxAttendees}名)` : '未設定'}
                            </div>
                            {isSelected && (
                                <div style={{
                                    position: 'absolute', top: '4px', right: '4px',
                                    width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)'
                                }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={selectedSlots.length === 0 || isSaving}
                    style={{ minWidth: '150px' }}
                >
                    {isSaving ? '処理中...' : (selectedSlots.length > 0 ? `${selectedSlots.length}枠を更新/作成` : '枠を選択してください')}
                </button>

                {selectedSlots.length > 0 && (
                    <button
                        onClick={handleDelete}
                        className="btn"
                        disabled={isSaving}
                        style={{ minWidth: '100px', background: 'var(--status-error)', color: 'white', border: 'none' }}
                    >
                        削除
                    </button>
                )}
            </div>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                ※ 既存の枠を選択して「更新」を押すと、定員数が上書きされます。
            </p>
        </div>
    );
}
