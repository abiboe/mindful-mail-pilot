
import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = SupabaseUser;

export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  summary?: string;
  date: string;
  read: boolean;
  important: boolean;
  hasAttachments: boolean;
  attachments?: Attachment[];
  labels?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  emailId?: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees: {
    name: string;
    email: string;
  }[];
  location?: string;
  emailId?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export type EmailPlatform = 'gmail' | 'outlook';

export interface EmailSummaryResult {
  summary: string;
  tasks: Task[];
  meetings?: Meeting[];
}
