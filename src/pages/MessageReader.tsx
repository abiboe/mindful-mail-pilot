
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const MessageReader = () => {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to analyze');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://usgducuowlhfkdbatfik.functions.supabase.co/analyze-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setSummary(data.summary);
      toast.success('Message analyzed successfully');
    } catch (error) {
      console.error('Error analyzing message:', error);
      toast.error('Failed to analyze message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Please log in to use the Message Reader</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Reader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[200px]"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={!message || isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Message
              </Button>
            </CardContent>
          </Card>

          {summary && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{summary}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessageReader;
