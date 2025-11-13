/**
 * כרטיס אירוע ביומן
 */

'use client';

import type { CalendarEvent } from '@/types';
import { formatTime } from '@/lib/utils/dateUtils';
import { getEventColor } from '@/lib/utils/colorUtils';
import { EventDetails } from './EventDetails';
import { EventTime } from './EventTime';
import './EventCard.css';

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const backgroundColor = getEventColor(event.color);

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className="event-card"
      style={{
        borderRightColor: backgroundColor,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="event-card-header">
        <h4 className="event-card-title">{event.title}</h4>
        <EventTime start={event.start} end={event.end} />
      </div>

      {(event.location || event.attendees) && (
        <EventDetails location={event.location} attendees={event.attendees} />
      )}

      {event.description && (
        <p className="event-card-description">{event.description}</p>
      )}
    </div>
  );
}

