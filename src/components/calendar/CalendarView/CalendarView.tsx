/**
 * קומפוננטת יומן ראשית עם React Big Calendar
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/he';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import type { CalendarEvent } from '@/types';
import { useCalendar } from '@/hooks/useCalendar';
import { useEvents } from '@/hooks/useEvents';
import { useTimeIndicator } from '@/hooks/useTimeIndicator';
import { Toolbar } from '../Toolbar';
import { EventModal } from '../EventModal';
import { TimeIndicator } from '../TimeIndicator';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Toast, type ToastType } from '../common/Toast';
import { HEBREW_DAY_NAMES_SHORT } from '@/constants/calendarConstants';
import { getEventColor } from '@/lib/utils/colorUtils';
import './CalendarView.css';

// הגדרת moment לעברית
moment.locale('he');
const localizer = momentLocalizer(moment);

// הוספת drag & drop
const DragAndDropCalendar = withDragAndDrop(Calendar);

export function CalendarView() {
  const { weekRange, events, isLoading, goToNextWeek, goToPreviousWeek, goToToday, refetch } = useCalendar();
  const { updateEvent } = useEvents();
  const { isToday } = useTimeIndicator();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([]);

  // סנכרון localEvents עם events מה-API
  useMemo(() => {
    setLocalEvents(events);
  }, [events]);

  // המרת אירועים לפורמט של React Big Calendar
  const calendarEvents = useMemo(() => {
    return localEvents.map(event => ({
      ...event,
      title: event.title,
      start: event.start,
      end: event.end,
    }));
  }, [localEvents]);

  // פתיחת מודל ליצירת אירוע חדש
  const handleNewEvent = useCallback(() => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  }, []);

  // פתיחת אירוע לעריכה
  const handleSelectEvent = useCallback((event: any) => {
    setSelectedEvent(event as CalendarEvent);
    setIsModalOpen(true);
  }, []);

  // שמירת אירוע (חדש או מעודכן)
  const handleSaveEvent = useCallback(async (event: CalendarEvent) => {
    await refetch();
    setToast({ message: 'האירוע נשמר בהצלחה', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  }, [refetch]);

  // מחיקת אירוע
  const handleDeleteEvent = useCallback(async (eventId: string) => {
    await refetch();
    setToast({ message: 'האירוע נמחק בהצלחה', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  }, [refetch]);

  // סנכרון עם Outlook
  const handleSync = useCallback(async () => {
    await refetch();
    setToast({ message: 'סנכרון הושלם', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  }, [refetch]);

  // Drag & Drop - עדכון אירוע
  const handleEventDrop = useCallback(async ({ event, start, end }: any) => {
    // עדכן מיידית ב-UI
    setLocalEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, start, end } : e
    ));

    // שלח לשרת
    const result = await updateEvent({
      id: event.id,
      start,
      end,
    });

    if (result) {
      setToast({ message: 'האירוע עודכן', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } else {
      // אם נכשל, החזר למצב הקודם
      await refetch();
      setToast({ message: 'שגיאה בעדכון האירוע', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  }, [updateEvent, refetch]);

  // Resize - שינוי משך אירוע
  const handleEventResize = useCallback(async ({ event, start, end }: any) => {
    // עדכן מיידית ב-UI
    setLocalEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, start, end } : e
    ));

    // שלח לשרת
    const result = await updateEvent({
      id: event.id,
      start,
      end,
    });

    if (result) {
      setToast({ message: 'משך האירוע עודכן', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } else {
      // אם נכשל, החזר למצב הקודם
      await refetch();
      setToast({ message: 'שגיאה בעדכון משך האירוע', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  }, [updateEvent, refetch]);

  // עיצוב אירועים
  const eventStyleGetter = useCallback((event: any) => {
    const color = getEventColor(event.color);
    return {
      style: {
        backgroundColor: color,
        borderRadius: '8px',
        border: 'none',
        color: 'white',
        padding: '4px 8px',
        fontSize: '13px',
        fontWeight: 500,
      },
    };
  }, []);

  // הגדרות RTL וקסטומיזציה
  const messages = {
    today: 'היום',
    previous: 'קודם',
    next: 'הבא',
    month: 'חודש',
    week: 'שבוע',
    day: 'יום',
    agenda: 'סדר יום',
    date: 'תאריך',
    time: 'שעה',
    event: 'אירוע',
    noEventsInRange: 'אין אירועים בתקופה זו',
  };

  const formats = {
    dayFormat: (date: Date) => {
      const dayName = HEBREW_DAY_NAMES_SHORT[date.getDay()];
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${dayName} ${day}/${month}`;
    },
  };

  if (isLoading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="calendar-container" dir="rtl">
      <Toolbar
        weekStart={weekRange.start}
        onPrevious={goToPreviousWeek}
        onNext={goToNextWeek}
        onToday={goToToday}
        onNewEvent={handleNewEvent}
        onSync={handleSync}
        isSyncing={isLoading}
      />

      <div className="calendar-wrapper">
        <DragAndDropCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor={(event: any) => event.start}
          endAccessor={(event: any) => event.end}
          style={{ height: '100%', flex: 1 }}
          view="week"
          views={['week']}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          messages={messages}
          formats={formats}
          rtl={true}
          date={weekRange.start}
          onNavigate={() => {}} // נעצור ניווט אוטומטי, נשתמש בכפתורים שלנו
          toolbar={false} // נסתיר את ה-toolbar המובנה
          step={30}
          timeslots={2}
          resizable
          draggableAccessor={() => true}
        />

        {/* סמן זמן נוכחי */}
        {isToday(weekRange.start) && <TimeIndicator />}
      </div>

      {/* מודל אירוע */}
      <EventModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Toast הודעות */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

