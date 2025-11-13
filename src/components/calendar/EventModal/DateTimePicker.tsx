/**
 * בוחר תאריך ושעה
 */

'use client';

import { format } from 'date-fns';

interface DateTimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export function DateTimePicker({ label, value, onChange }: DateTimePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(value.getHours(), value.getMinutes());
    onChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours, minutes);
    onChange(newDate);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="date"
          value={format(value, 'yyyy-MM-dd')}
          onChange={handleDateChange}
          className="
            px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            text-right
          "
          dir="ltr"
        />
        <input
          type="time"
          value={format(value, 'HH:mm')}
          onChange={handleTimeChange}
          className="
            px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            text-right
          "
          dir="ltr"
        />
      </div>
    </div>
  );
}

