import React, { useEffect, useState } from 'react';
import { availabilityService, ProviderAvailability, WeeklySchedule } from '../../services/availabilityService';
import { toast } from 'react-hot-toast';
import { Clock, Calendar, Save, Plus, Trash2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_SCHEDULE: WeeklySchedule = DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
}), {});

const EMPTY_SCHEDULE: WeeklySchedule = DAYS.reduce((acc, day) => ({
    ...acc,
    [day]: { enabled: false, slots: [] },
}), {});

const normalizeWeeklySchedule = (rawSchedule: any): WeeklySchedule => {
    const parsed =
        typeof rawSchedule === 'string'
            ? (() => {
                  try {
                      return JSON.parse(rawSchedule);
                  } catch {
                      return {};
                  }
              })()
            : rawSchedule || {};

    const normalized: WeeklySchedule = { ...EMPTY_SCHEDULE };

    DAYS.forEach((day) => {
        const foundKey = Object.keys(parsed).find(
            (k) => k.toLowerCase() === day.toLowerCase(),
        );

        if (!foundKey) return;

        const loadedDay = parsed[foundKey] || {};
        const slots = Array.isArray(loadedDay.slots) ? loadedDay.slots : [];

        normalized[day] = {
            enabled: loadedDay.enabled ?? false,
            slots: slots.map((s) => ({
                start: s?.start ?? '09:00',
                end: s?.end ?? '17:00',
            })),
        };
    });

    return normalized;
};

export const AvailabilitySettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availability, setAvailability] = useState<Partial<ProviderAvailability>>({
        weeklySchedule: EMPTY_SCHEDULE,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        bufferTime: 15,
        minAdvanceBooking: 24,
        maxAdvanceBooking: 30,
        autoAccept: false,
        blockedDates: [],
    });

    useEffect(() => {
        loadAvailability();
    }, []);

    const loadAvailability = async () => {
        try {
            const data = await availabilityService.getAvailability();
            console.debug('[AvailabilitySettingsPage] loaded availability', data);
            if (data) {
                const schedule = normalizeWeeklySchedule(data.weeklySchedule);
                console.debug('[AvailabilitySettingsPage] normalized schedule', schedule);

                setAvailability({
                    weeklySchedule: schedule,
                    timezone: data.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
                    bufferTime: data.bufferTime ?? 15,
                    minAdvanceBooking: data.minAdvanceBooking ?? 24,
                    maxAdvanceBooking: data.maxAdvanceBooking ?? 30,
                    autoAccept: data.autoAccept ?? false,
                    blockedDates: data.blockedDates ?? [],
                    maxSessionsPerDay: data.maxSessionsPerDay,
                });
            } else {
                setAvailability({
                    weeklySchedule: DEFAULT_SCHEDULE,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    bufferTime: 15,
                    minAdvanceBooking: 24,
                    maxAdvanceBooking: 30,
                    autoAccept: false,
                    blockedDates: [],
                });
            }
        } catch (error) {
            console.error('Failed to load availability', error);
            toast.error('Failed to load availability settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const base = availability ?? {
                weeklySchedule: EMPTY_SCHEDULE,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                bufferTime: 15,
                minAdvanceBooking: 24,
                maxAdvanceBooking: 30,
                autoAccept: false,
                blockedDates: [],
            };

            const safeSchedule = normalizeWeeklySchedule(base.weeklySchedule || {});

            const updated = await availabilityService.updateAvailability({
                ...base,
                weeklySchedule: safeSchedule,
            });
            console.debug('[AvailabilitySettingsPage] save response', updated);
            setAvailability({
                weeklySchedule: normalizeWeeklySchedule(updated.weeklySchedule),
                timezone: updated.timezone ?? availability.timezone,
                bufferTime: updated.bufferTime ?? availability.bufferTime,
                minAdvanceBooking: updated.minAdvanceBooking ?? availability.minAdvanceBooking,
                maxAdvanceBooking: updated.maxAdvanceBooking ?? availability.maxAdvanceBooking,
                autoAccept: updated.autoAccept ?? availability.autoAccept,
                blockedDates: updated.blockedDates ?? availability.blockedDates ?? [],
                maxSessionsPerDay: updated.maxSessionsPerDay ?? availability.maxSessionsPerDay,
            });
            toast.success('Availability settings saved!');
        } catch (error) {
            console.error('Failed to save availability', error);
            toast.error('Failed to save availability settings');
        } finally {
            setSaving(false);
        }
    };

    const updateSchedule = (day: string, updates: any) => {
        setAvailability(prev => {
            const currentSchedule = prev.weeklySchedule || normalizeWeeklySchedule({});
            return {
                ...prev,
                weeklySchedule: {
                    ...currentSchedule,
                    [day]: { ...currentSchedule[day], ...updates },
                },
            };
        });
    };

    const addSlot = (day: string) => {
        const currentSlots = (availability.weeklySchedule || normalizeWeeklySchedule({}))[day].slots;
        updateSchedule(day, { slots: [...currentSlots, { start: '09:00', end: '17:00' }] });
    };

    const removeSlot = (day: string, index: number) => {
        const currentSlots = (availability.weeklySchedule || normalizeWeeklySchedule({}))[day].slots;
        updateSchedule(day, { slots: currentSlots.filter((_, i) => i !== index) });
    };

    const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
        const currentSlots = [...(availability.weeklySchedule || normalizeWeeklySchedule({}))[day].slots];
        currentSlots[index] = { ...currentSlots[index], [field]: value };
        updateSchedule(day, { slots: currentSlots });
    };

    const convertTo24Hour = (time12: string, ampm: string) => {
        const [hours, minutes] = time12.split(':');
        let hour = parseInt(hours);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${minutes}`;
    };

    const TimeSelector = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
        const [hours, minutes] = value.split(':');
        const hourInt = parseInt(hours);
        const initialAmpm = hourInt >= 12 ? 'PM' : 'AM';
        const initialHour12 = (hourInt % 12 || 12).toString().padStart(2, '0');

        return (
            <div className="flex items-center gap-2">
                <select
                    value={initialHour12}
                    onChange={(e) => onChange(convertTo24Hour(`${e.target.value}:${minutes}`, initialAmpm))}
                    className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 text-sm"
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                        <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                    ))}
                </select>
                <span className="text-gray-400">:</span>
                <select
                    value={minutes}
                    onChange={(e) => onChange(convertTo24Hour(`${initialHour12}:${e.target.value}`, initialAmpm))}
                    className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 text-sm"
                >
                    {['00', '15', '30', '45'].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <select
                    value={initialAmpm}
                    onChange={(e) => onChange(convertTo24Hour(`${initialHour12}:${minutes}`, e.target.value))}
                    className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-1 px-2 text-sm"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Availability Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* General Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="text-indigo-600" />
                    General Preferences
                </h2>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <select
                            value={availability.timezone}
                            onChange={(e) => setAvailability(prev => ({ ...prev, timezone: e.target.value }))}
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {(Intl as any).supportedValuesOf('timeZone').map((tz: string) => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (minutes)</label>
                        <select
                            value={availability.bufferTime}
                            onChange={(e) => setAvailability(prev => ({ ...prev, bufferTime: Number(e.target.value) }))}
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {[0, 15, 30, 45, 60].map(min => (
                                <option key={min} value={min}>{min} minutes</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="text-indigo-600" />
                    Weekly Schedule
                </h2>

                <div className="space-y-6">
                    {DAYS.map(day => {
                        const schedule = availability.weeklySchedule || normalizeWeeklySchedule({});
                        const daySchedule = schedule[day];
                        return (
                            <div key={day} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={daySchedule.enabled}
                                            onChange={(e) => updateSchedule(day, { enabled: e.target.checked })}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="font-medium text-gray-900 w-24">{day}</span>
                                    </div>
                                    {daySchedule.enabled && (
                                        <button
                                            onClick={() => addSlot(day)}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                        >
                                            <Plus size={16} /> Add Slot
                                        </button>
                                    )}
                                </div>

                                {daySchedule.enabled && (
                                    <div className="pl-8 space-y-3">
                                        {daySchedule.slots.map((slot, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <TimeSelector
                                                    value={slot.start}
                                                    onChange={(val) => updateSlot(day, index, 'start', val)}
                                                />
                                                <span className="text-gray-400">-</span>
                                                <TimeSelector
                                                    value={slot.end}
                                                    onChange={(val) => updateSlot(day, index, 'end', val)}
                                                />
                                                <button
                                                    onClick={() => removeSlot(day, index)}
                                                    className="text-gray-400 hover:text-red-500 ml-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
};
