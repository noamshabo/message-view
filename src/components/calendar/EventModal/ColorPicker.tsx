/**
 * בוחר צבעים לאירוע
 */

'use client';

import { AVAILABLE_COLORS } from '@/constants/colors';

interface ColorPickerProps {
  selectedColor?: string;
  onColorChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        צבע
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_COLORS.map(({ name, value }) => (
          <button
            key={name}
            type="button"
            onClick={() => onColorChange(name)}
            className={`
              w-10 h-10 rounded-lg transition-all duration-200
              hover:scale-110 active:scale-95
              ${selectedColor === name ? 'ring-2 ring-offset-2 ring-gray-400' : ''}
            `}
            style={{ backgroundColor: value }}
            title={name}
            aria-label={`בחר צבע ${name}`}
          />
        ))}
      </div>
    </div>
  );
}

