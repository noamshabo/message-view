/**
 * מודל ליצירה/עריכה של אירוע
 */

'use client';

import { useState } from 'react';
import type { CalendarEvent, CreateEventInput } from '@/types';
import { useEvents } from '@/hooks/useEvents';
import { EventForm } from './EventForm';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import './EventModal.css';

interface EventModalProps {
  isOpen: boolean;
  event?: CalendarEvent;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
}

export function EventModal({ isOpen, event, onClose, onSave, onDelete }: EventModalProps) {
  const { createEvent, updateEvent, deleteEvent, isSaving } = useEvents();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (data: CreateEventInput) => {
    if (event) {
      // עדכון אירוע קיים
      const updated = await updateEvent({ ...data, id: event.id });
      if (updated) {
        onSave(updated);
        onClose();
      }
    } else {
      // יצירת אירוע חדש
      const newEvent = await createEvent(data);
      if (newEvent) {
        onSave(newEvent);
        onClose();
      }
    }
  };

  const handleDelete = async () => {
    if (event) {
      const success = await deleteEvent(event.id);
      if (success) {
        onDelete?.(event.id);
        setShowDeleteConfirm(false);
        onClose();
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="event-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="event-modal">
        <div className="event-modal-header">
          <h2 className="event-modal-title">
            {event ? 'עריכת אירוע' : 'אירוע חדש'}
          </h2>
          <button
            onClick={onClose}
            className="event-modal-close"
            aria-label="סגור"
          >
            ✕
          </button>
        </div>

        <div className="event-modal-body">
          <EventForm
            event={event}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isSaving}
          />

          {event && onDelete && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSaving}
                className="w-full"
              >
                מחק אירוע
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="מחיקת אירוע"
        message="האם אתה בטוח שברצונך למחוק את האירוע? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        cancelLabel="ביטול"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

