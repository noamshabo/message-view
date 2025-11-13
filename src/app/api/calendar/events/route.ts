/**
 * API Route לניהול אירועים
 * GET - קבלת אירועים
 * POST - יצירת אירוע חדש
 * PUT - עדכון אירוע
 * DELETE - מחיקת אירוע
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOutlookEvents, createOutlookEvent, updateOutlookEvent, deleteOutlookEvent } from '@/lib/calendar/outlookClient';
import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';

/**
 * GET - קבלת אירועים לטווח תאריכים
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    
    if (!startParam || !endParam) {
      return NextResponse.json(
        { error: 'Missing start or end date parameters' },
        { status: 400 }
      );
    }
    
    const startDate = new Date(startParam);
    const endDate = new Date(endParam);
    
    const events = await getOutlookEvents(startDate, endDate);
    
    return NextResponse.json({ events, success: true });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', success: false },
      { status: 500 }
    );
  }
}

/**
 * POST - יצירת אירוע חדש
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventInput: CreateEventInput = {
      ...body,
      start: new Date(body.start),
      end: new Date(body.end),
    };
    
    // Validation
    if (!eventInput.title || !eventInput.start || !eventInput.end) {
      return NextResponse.json(
        { error: 'Missing required fields: title, start, end', success: false },
        { status: 400 }
      );
    }
    
    if (eventInput.start >= eventInput.end) {
      return NextResponse.json(
        { error: 'Start time must be before end time', success: false },
        { status: 400 }
      );
    }
    
    const newEvent = await createOutlookEvent(eventInput);
    
    return NextResponse.json({ event: newEvent, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', success: false },
      { status: 500 }
    );
  }
}

/**
 * PUT - עדכון אירוע קיים
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing event ID', success: false },
        { status: 400 }
      );
    }
    
    const updates: UpdateEventInput = {
      ...body,
      start: body.start ? new Date(body.start) : undefined,
      end: body.end ? new Date(body.end) : undefined,
    };
    
    // Validation
    if (updates.start && updates.end && updates.start >= updates.end) {
      return NextResponse.json(
        { error: 'Start time must be before end time', success: false },
        { status: 400 }
      );
    }
    
    const updatedEvent = await updateOutlookEvent(body.id, updates);
    
    return NextResponse.json({ event: updatedEvent, success: true });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', success: false },
      { status: 500 }
    );
  }
}

/**
 * DELETE - מחיקת אירוע
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing event ID', success: false },
        { status: 400 }
      );
    }
    
    await deleteOutlookEvent(eventId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', success: false },
      { status: 500 }
    );
  }
}

