/**
 * כפתור "היום"
 */

'use client';

import { Button } from '../common/Button';

interface TodayButtonProps {
  onClick: () => void;
}

export function TodayButton({ onClick }: TodayButtonProps) {
  return (
    <Button variant="secondary" onClick={onClick}>
      היום
    </Button>
  );
}

