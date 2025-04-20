
import { Email, EmailSummaryResult } from '@/types';

// Mock data for emails
const mockEmails: Email[] = [
  {
    id: 'email-1',
    from: { name: 'Alice Johnson', email: 'alice@example.com' },
    to: [{ name: 'John Doe', email: 'john.doe@gmail.com' }],
    subject: 'Quarterly Report Review Meeting',
    body: `Hi John,

I hope this email finds you well. I'd like to schedule a meeting to discuss the quarterly report before presenting it to the board next week.

Could you please review the attached draft and let me know your availability for a 30-minute discussion tomorrow or Wednesday?

Key points to discuss:
- Sales performance variance in the Western region
- New customer acquisition strategy results
- Budget allocation for Q3

Please also prepare a summary of your team's performance highlights.

Thanks,
Alice Johnson
VP of Operations`,
    summary: 'Alice wants to schedule a meeting to discuss the quarterly report. She needs your review of the draft and availability for tomorrow or Wednesday.',
    date: '2025-04-20T10:30:00Z',
    read: false,
    important: true,
    hasAttachments: true,
    attachments: [
      {
        id: 'attach-1',
        name: 'Q2-Report-Draft.pdf',
        type: 'application/pdf',
        size: 2456789,
        url: '#'
      }
    ],
    labels: ['work', 'important']
  },
  {
    id: 'email-2',
    from: { name: 'Project Sync', email: 'notifications@projectsync.com' },
    to: [{ name: 'John Doe', email: 'john.doe@gmail.com' }],
    subject: 'Task assigned: Complete user interview analysis',
    body: `You've been assigned a new task:

Task: Complete user interview analysis
Due: April 23, 2025
Priority: High

Description:
Analyze the results of the 12 user interviews conducted last week and prepare a summary of key findings and recommendations.

Click here to view the task details and resources.

Project Sync Team`,
    summary: 'New high-priority task assigned: Complete user interview analysis by April 23rd. Need to review 12 interviews and prepare findings summary.',
    date: '2025-04-19T16:45:00Z',
    read: true,
    important: true,
    hasAttachments: false,
    labels: ['task', 'high-priority']
  },
  {
    id: 'email-3',
    from: { name: 'Marketing Team', email: 'marketing@company.com' },
    to: [{ name: 'Product Team', email: 'product@company.com' }],
    cc: [{ name: 'John Doe', email: 'john.doe@gmail.com' }],
    subject: 'New Feature Announcement Plan',
    body: `Hello Product Team,

We're preparing the marketing materials for the new feature launch next month. Could you please provide:

1. Final list of features to highlight
2. Technical requirements for users
3. Screenshots or demo videos of the key functionality
4. Quote from the product team about the feature's impact

We need this information by end of week to stay on schedule.

Thanks,
Marketing Team`,
    summary: 'Marketing needs product details for new feature announcement: feature list, tech requirements, visuals, and team quote by end of week.',
    date: '2025-04-18T09:15:00Z',
    read: true,
    important: false,
    hasAttachments: false,
    labels: ['work']
  },
  {
    id: 'email-4',
    from: { name: 'HR Department', email: 'hr@company.com' },
    to: [{ name: 'All Staff', email: 'staff@company.com' }],
    subject: 'Reminder: Annual Benefits Enrollment Deadline',
    body: `Dear Team Members,

This is a friendly reminder that the annual benefits enrollment period ends this Friday, April 25th at 5:00 PM.

If you haven't done so yet, please log into the HR portal to:
- Review your current benefits
- Update your selections for the next fiscal year
- Add or remove dependents if needed
- Update beneficiary information

If you need assistance, please contact HR support at ext. 4455 or reply to this email.

Best regards,
HR Department`,
    summary: 'Annual benefits enrollment deadline is this Friday (April 25th). Need to review and update selections in HR portal.',
    date: '2025-04-18T14:20:00Z',
    read: true,
    important: false,
    hasAttachments: false,
    labels: ['administrative']
  },
  {
    id: 'email-5',
    from: { name: 'David Wang', email: 'david.wang@partner.org' },
    to: [{ name: 'John Doe', email: 'john.doe@gmail.com' }],
    subject: 'Collaboration Proposal: AI Ethics Framework',
    body: `Hi John,

Following our conversation at the tech conference last month, I'd like to propose a collaboration between our organizations on developing an ethical framework for AI implementation in healthcare.

Our team has been researching this area for the past year, and your expertise in data privacy would be invaluable. I believe together we could create guidelines that could become an industry standard.

Are you interested in discussing this further? I'm available next week for an initial call to explore the idea.

Best regards,
David Wang
Director of AI Ethics
Partner Organization`,
    summary: 'David Wang is proposing a collaboration on an AI ethics framework for healthcare, leveraging your data privacy expertise. He wants to schedule a call next week.',
    date: '2025-04-17T11:05:00Z',
    read: false,
    important: true,
    hasAttachments: false,
    labels: ['partnership', 'important']
  }
];

// Get all emails
export const getEmails = async (): Promise<Email[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockEmails;
};

// Get a single email by ID
export const getEmailById = async (id: string): Promise<Email | undefined> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEmails.find(email => email.id === id);
};

// Mark email as read
export const markEmailAsRead = async (id: string): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 300));
  // In a real implementation, we would update the backend
  return true;
};

// Generate summary for email
export const generateEmailSummary = async (emailId: string): Promise<EmailSummaryResult> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const email = mockEmails.find(email => email.id === emailId);
  if (!email) {
    throw new Error('Email not found');
  }
  
  // In a real implementation, this would call an AI service
  return {
    summary: email.summary || 'No summary available',
    tasks: [
      {
        id: `task-${Date.now()}`,
        title: email.id === 'email-1' 
          ? 'Review quarterly report draft' 
          : email.id === 'email-2'
          ? 'Complete user interview analysis'
          : 'Follow up on email',
        completed: false,
        priority: email.id === 'email-2' ? 'high' : 'medium',
        dueDate: email.id === 'email-2' ? '2025-04-23' : undefined,
        emailId: email.id,
        createdAt: new Date().toISOString(),
      },
    ],
    meetings: email.id === 'email-1' ? [
      {
        id: `meeting-${Date.now()}`,
        title: 'Quarterly Report Review Meeting',
        description: 'Discuss the quarterly report draft before board presentation',
        startTime: '2025-04-21T14:00:00Z',
        endTime: '2025-04-21T14:30:00Z',
        attendees: [
          { name: 'John Doe', email: 'john.doe@gmail.com' },
          { name: 'Alice Johnson', email: 'alice@example.com' }
        ],
        emailId: email.id,
      }
    ] : undefined,
  };
};

// Search emails
export const searchEmails = async (query: string): Promise<Email[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple search implementation
  const lowerQuery = query.toLowerCase();
  return mockEmails.filter(email => {
    return (
      email.subject.toLowerCase().includes(lowerQuery) ||
      email.body.toLowerCase().includes(lowerQuery) ||
      email.from.name.toLowerCase().includes(lowerQuery) ||
      email.from.email.toLowerCase().includes(lowerQuery)
    );
  });
};
