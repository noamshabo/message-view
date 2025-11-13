/**
 * כפתורי ניווט - הבא/הקודם
 */

'use client';

import { IconButton } from '../common/IconButton';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationButtons({ onPrevious, onNext }: NavigationButtonsProps) {
  return (
    <div className="flex gap-2">
      <IconButton
        icon="▶"
        label="שבוע הבא"
        onClick={onNext}
      />
      <IconButton
        icon="◀"
        label="שבוע קודם"
        onClick={onPrevious}
      />
    </div>
  );
}

