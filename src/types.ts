export type Message = {
  Id?: string | number;
  CreatedAt: string;
  UpdatedAt?: string;
  message_type: "in" | "out" | "incoming";
  from_phone: string;
  customer_phone: string;
  customer_name?: string;
  content: string;
  date_of_meeting?: string | null;
  customer_start_hour?: string | null;
  route?: string;
  conversation_id: string;
};

// Export calendar types
export * from './types/event.types';
export * from './types/calendar.types';
export * from './types/outlook.types';

