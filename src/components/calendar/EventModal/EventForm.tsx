/**
 * טופס יצירה/עריכה של אירוע
 */

'use client';

import { useState } from 'react';
import type { CalendarEvent, CreateEventInput } from '@/types';
import { ColorPicker } from './ColorPicker';
import { DateTimePicker } from './DateTimePicker';
import { Button } from '../common/Button';

interface EventFormProps {
  event?: CalendarEvent;
  onSubmit: (data: CreateEventInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({ event, onSubmit, onCancel, isLoading }: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventInput>({
    title: event?.title || '',
    description: event?.description || '',
    start: event?.start || new Date(),
    end: event?.end || new Date(Date.now() + 3600000), // +1 hour
    location: event?.location || '',
    attendees: event?.attendees || [],
    color: event?.color || 'indigo',
    isAllDay: event?.isAllDay || false,
    status: event?.status || 'confirmed',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAttendeesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const attendees = e.target.value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    setFormData({ ...formData, attendees });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {/* כותרת */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          כותרת *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          "
          placeholder="שם האירוע"
        />
      </div>

      {/* תאריך ושעה התחלה */}
      <DateTimePicker
        label="תאריך ושעה התחלה *"
        value={formData.start}
        onChange={(date) => setFormData({ ...formData, start: date })}
      />

      {/* תאריך ושעה סיום */}
      <DateTimePicker
        label="תאריך ושעה סיום *"
        value={formData.end}
        onChange={(date) => setFormData({ ...formData, end: date })}
      />

      {/* תיאור */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תיאור
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            resize-none
          "
          placeholder="פרטים נוספים על האירוע"
        />
      </div>

      {/* מיקום */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          מיקום
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          "
          placeholder="כתובת או שם המקום"
        />
      </div>

      {/* משתתפים */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          משתתפים
        </label>
        <textarea
          value={formData.attendees?.join('\n') || ''}
          onChange={handleAttendeesChange}
          rows={3}
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            resize-none
          "
          placeholder="שם אחד בכל שורה"
        />
      </div>

      {/* בוחר צבע */}
      <ColorPicker
        selectedColor={formData.color}
        onColorChange={(color) => setFormData({ ...formData, color })}
      />

      {/* כפתורים */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
          {isLoading ? 'שומר...' : event ? 'עדכן' : 'צור אירוע'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          ביטול
        </Button>
      </div>
    </form>
  );
}

