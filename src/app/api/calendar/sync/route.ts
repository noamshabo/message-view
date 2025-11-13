/**
 * API Route לסנכרון עם Outlook
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncWithOutlook } from '@/lib/calendar/outlookClient';
import { fullSync } from '@/lib/calendar/calendarSync';

/**
 * POST - סנכרון מלא עם Outlook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startDate, endDate } = body;
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing start or end date', success: false },
        { status: 400 }
      );
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const result = await fullSync(start, end);
    
    if (result.success) {
      return NextResponse.json({ 
        result, 
        success: true,
        message: 'סנכרון הושלם בהצלחה'
      });
    } else {
      return NextResponse.json(
        { result, success: false, message: 'סנכרון נכשל' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error syncing with Outlook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync with Outlook', 
        success: false,
        message: 'שגיאה בסנכרון'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - בדיקת סטטוס סנכרון
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'ready',
    message: 'Sync service is available',
  });
}

