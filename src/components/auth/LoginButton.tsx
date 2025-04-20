
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoginButtonProps {
  platform: 'gmail' | 'outlook';
}

export const LoginButton: React.FC<LoginButtonProps> = ({ platform }) => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: platform === 'gmail' ? 'google' : 'azure',
      options: {
        redirectTo: window.location.origin,
        // You can add scopes here if needed
        // scopes: 'email profile'
      }
    });

    if (error) {
      toast.error(`Login with ${platform} failed`, {
        description: error.message
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className={`w-full ${
        platform === 'gmail'
          ? 'border-[#DB4437] hover:bg-[#DB4437]/10 text-[#DB4437]'
          : 'border-[#0078D4] hover:bg-[#0078D4]/10 text-[#0078D4]'
      }`}
      onClick={handleLogin}
    >
      <Mail className="mr-2 h-4 w-4" />
      Continue with {platform === 'gmail' ? 'Gmail' : 'Outlook'}
    </Button>
  );
};
