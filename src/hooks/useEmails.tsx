
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Email, EmailSummaryResult } from '@/types';
import { getEmails, getEmailById, markEmailAsRead, generateEmailSummary } from '@/services/emailService';
import { toast } from 'sonner';

export const useEmails = () => {
  const queryClient = useQueryClient();
  
  // Fetch all emails
  const { 
    data: emails = [],
    isLoading: isLoadingEmails,
    error: emailsError,
    refetch: refetchEmails
  } = useQuery({
    queryKey: ['emails'],
    queryFn: getEmails,
  });
  
  // Mark email as read
  const { mutate: markRead } = useMutation({
    mutationFn: (emailId: string) => markEmailAsRead(emailId),
    onSuccess: (_, emailId) => {
      // Update the email in the cache
      queryClient.setQueryData(['emails'], (oldData: Email[] = []) => {
        return oldData.map(email => 
          email.id === emailId ? { ...email, read: true } : email
        );
      });
    },
    onError: () => {
      toast.error('Failed to mark email as read');
    }
  });
  
  // Generate summary for an email
  const { 
    mutate: summarizeEmail,
    isPending: isSummarizing,
    data: summaryResult
  } = useMutation({
    mutationFn: generateEmailSummary,
    onSuccess: (data) => {
      toast.success('Email summarized successfully');
    },
    onError: () => {
      toast.error('Failed to generate summary');
    }
  });
  
  // Get unread count
  const unreadCount = emails.filter(email => !email.read).length;
  
  // Get important emails
  const importantEmails = emails.filter(email => email.important);
  
  return {
    emails,
    isLoadingEmails,
    emailsError,
    refetchEmails,
    markRead,
    unreadCount,
    importantEmails,
    summarizeEmail,
    isSummarizing,
    summaryResult,
  };
};

export const useEmail = (emailId: string | undefined) => {
  const queryClient = useQueryClient();
  
  // Get single email
  const { 
    data: email,
    isLoading,
    error
  } = useQuery({
    queryKey: ['email', emailId],
    queryFn: () => emailId ? getEmailById(emailId) : null,
    enabled: !!emailId,
  });
  
  // Mark as read when email is opened
  useEffect(() => {
    if (email && !email.read) {
      markEmailAsRead(email.id).then(() => {
        // Update the email in the cache
        queryClient.setQueryData(['email', emailId], {
          ...email,
          read: true,
        });
        
        // Update in emails list cache as well
        queryClient.setQueryData(['emails'], (oldData: Email[] = []) => {
          return oldData.map(item => 
            item.id === email.id ? { ...item, read: true } : item
          );
        });
      });
    }
  }, [email, emailId, queryClient]);
  
  return {
    email,
    isLoading,
    error,
  };
};
