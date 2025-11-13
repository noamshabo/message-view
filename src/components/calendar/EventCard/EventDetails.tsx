/**
 * פרטי אירוע - מיקום ומשתתפים
 */

'use client';

interface EventDetailsProps {
  location?: string;
  attendees?: string[];
}

export function EventDetails({ location, attendees }: EventDetailsProps) {
  return (
    <div className="mt-2 space-y-1">
      {location && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>📍</span>
          <span className="truncate">{location}</span>
        </div>
      )}

      {attendees && attendees.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>👥</span>
          <span className="truncate">
            {attendees.length === 1
              ? attendees[0]
              : `${attendees[0]} +${attendees.length - 1}`}
          </span>
        </div>
      )}
    </div>
  );
}

