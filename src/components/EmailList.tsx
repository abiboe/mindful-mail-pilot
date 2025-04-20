
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Paperclip, Star } from 'lucide-react';
import { Email } from '@/types';
import { format } from 'date-fns';

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (emailId: string) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail }) => {
  if (emails.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No emails found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {emails.map((email) => (
        <Card 
          key={email.id} 
          className={`cursor-pointer transition-all hover:shadow ${!email.read ? 'border-l-4 border-l-primary' : ''}`}
          onClick={() => onSelectEmail(email.id)}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox id={`email-${email.id}`} className="mt-0.5" />
              <CardTitle className={`text-base ${!email.read ? 'font-semibold' : ''}`}>
                {email.from.name}
              </CardTitle>
              {email.important && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              {email.hasAttachments && <Paperclip className="h-4 w-4" />}
              <span className="text-xs">
                {format(new Date(email.date), 'MMM d, h:mm a')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-1 text-base font-medium text-foreground">
              {email.subject}
            </CardDescription>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {email.body.substring(0, 150)}...
            </p>
            {email.labels && email.labels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {email.labels.map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
