
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Mail, 
  Reply, 
  Star, 
  Trash, 
  Download, 
  Calendar,
  Paperclip,
  Clock
} from 'lucide-react';
import { Email, EmailSummaryResult } from '@/types';
import { TaskList } from './TaskList';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasksByEmailId } from '@/hooks/useTasks';
import { Separator } from '@/components/ui/separator';

interface EmailSummaryProps {
  email: Email;
  onBack: () => void;
  summary?: EmailSummaryResult;
  onGenerateSummary: () => void;
  isSummarizing: boolean;
}

export const EmailSummary: React.FC<EmailSummaryProps> = ({
  email,
  onBack,
  summary,
  onGenerateSummary,
  isSummarizing,
}) => {
  const { tasks, isLoading } = useTasksByEmailId(email.id);
  const [showFullEmail, setShowFullEmail] = useState(true);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatEmailBody = (body: string) => {
    return body.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className={`h-5 w-5 ${email.important ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <Reply className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{email.subject}</h1>
            <div className="mt-4 flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{email.from.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{email.from.name}</p>
                    <span className="text-xs text-muted-foreground">&lt;{email.from.email}&gt;</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    To: {email.to.map(recipient => recipient.name).join(', ')}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(email.date), 'PPP p')}
              </div>
            </div>
          </div>

          {summary ? (
            <div className="space-y-6">
              <Card className="bg-accent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{summary.summary}</p>
                </CardContent>
              </Card>

              {summary.tasks && summary.tasks.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Extracted Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TaskList tasks={summary.tasks} />
                  </CardContent>
                </Card>
              )}

              {summary.meetings && summary.meetings.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Suggested Meetings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {summary.meetings.map(meeting => (
                        <div key={meeting.id} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-1 h-5 w-5 text-primary" />
                            <div>
                              <h4 className="font-medium">{meeting.title}</h4>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {format(new Date(meeting.startTime), 'MMM d, h:mm a')} - 
                                  {format(new Date(meeting.endTime), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Schedule
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setShowFullEmail(!showFullEmail)}
              >
                {showFullEmail ? 'Hide Full Email' : 'Show Full Email'}
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={onGenerateSummary} 
                disabled={isSummarizing}
                variant="outline"
              >
                {isSummarizing ? 'Generating Summary...' : 'Generate Summary'}
              </Button>
            </div>
          )}

          {(showFullEmail || !summary) && (
            <div className="relative rounded-md border p-4">
              <div className="prose max-w-none">
                {formatEmailBody(email.body)}
              </div>

              {email.hasAttachments && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <h3 className="mb-3 font-medium">Attachments</h3>
                  <div className="space-y-2">
                    {email.attachments?.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatBytes(attachment.size)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
