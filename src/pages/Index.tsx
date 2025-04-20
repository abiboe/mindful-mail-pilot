
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthScreen } from '@/components/auth/AuthProvider';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { EmailList } from '@/components/EmailList';
import { EmailSummary } from '@/components/EmailSummary';
import { TaskList } from '@/components/TaskList';
import { useEmails } from '@/hooks/useEmails';
import { useTasks } from '@/hooks/useTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, isLoading, refreshSession } = useAuth();
  const [selectedView, setSelectedView] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    emails, 
    isLoadingEmails, 
    importantEmails,
    summarizeEmail,
    isSummarizing,
    summaryResult
  } = useEmails();
  
  const { tasks, todayTasks, overdueTasks } = useTasks();
  
  // Handle URL params for authentication flow
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check for auth token in URL
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      
      if (access_token && refresh_token && type) {
        try {
          // Set the session from URL parameters
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          
          if (error) throw error;
          
          await refreshSession();
          toast.success('Email verified successfully!');
          
          // Remove auth parameters from URL
          navigate('/', { replace: true });
        } catch (error) {
          console.error('Auth redirect error:', error);
          toast.error('Authentication failed. Please try again.');
        }
      }
    };

    handleAuthRedirect();
  }, [searchParams, navigate, refreshSession]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }
  
  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }
  
  const handleSelectEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
  };
  
  const handleBackToList = () => {
    setSelectedEmailId(null);
  };
  
  const handleGenerateSummary = () => {
    if (selectedEmailId) {
      summarizeEmail(selectedEmailId);
    }
  };
  
  // Filter emails based on the selected view
  const filteredEmails = (() => {
    switch (selectedView) {
      case 'important':
        return importantEmails;
      default:
        return emails;
    }
  })();
  
  const selectedEmail = selectedEmailId 
    ? emails.find(email => email.id === selectedEmailId) 
    : null;
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeItem={selectedView} onSelectItem={setSelectedView} />
          
          <main className="flex-1 overflow-y-auto">
            {selectedView === 'tasks' ? (
              <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-bold">Tasks</h1>
                
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="today">Due Today</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <TaskList tasks={tasks} showActions />
                  </TabsContent>
                  <TabsContent value="today" className="mt-4">
                    <TaskList tasks={todayTasks} showActions />
                  </TabsContent>
                  <TabsContent value="overdue" className="mt-4">
                    <TaskList tasks={overdueTasks} showActions />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="container mx-auto py-6">
                {selectedEmail ? (
                  <EmailSummary 
                    email={selectedEmail} 
                    onBack={handleBackToList}
                    summary={summaryResult}
                    onGenerateSummary={handleGenerateSummary}
                    isSummarizing={isSummarizing}
                  />
                ) : (
                  <div>
                    <h1 className="mb-6 text-2xl font-bold">
                      {selectedView === 'important' ? 'Important' : 'Inbox'}
                    </h1>
                    {isLoadingEmails ? (
                      <div className="flex h-64 items-center justify-center">
                        <p className="text-muted-foreground">Loading emails...</p>
                      </div>
                    ) : (
                      <EmailList 
                        emails={filteredEmails} 
                        onSelectEmail={handleSelectEmail} 
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
