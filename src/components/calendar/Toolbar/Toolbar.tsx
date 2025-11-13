/**
 * סרגל כלים עליון של היומן
 */

'use client';

import { formatWeekTitle } from '@/lib/utils/dateUtils';
import { TodayButton } from './TodayButton';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';

interface ToolbarProps {
  weekStart: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function Toolbar({
  weekStart,
  onPrevious,
  onNext,
  onToday,
  onNewEvent,
  onSync,
  isSyncing,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200" dir="rtl">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {formatWeekTitle(weekStart)}
        </h2>
        <div className="flex items-center gap-2">
          <IconButton
            icon="▶"
            label="שבוע הבא"
            onClick={onNext}
          />
          <TodayButton onClick={onToday} />
          <IconButton
            icon="◀"
            label="שבוע קודם"
            onClick={onPrevious}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onNewEvent && (
          <Button variant="primary" onClick={onNewEvent}>
            + אירוע חדש
          </Button>
        )}
      </div>
    </div>
  );
}

