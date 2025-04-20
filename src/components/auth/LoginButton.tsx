
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginButtonProps {
  platform: 'gmail' | 'outlook';
}

export const LoginButton: React.FC<LoginButtonProps> = ({ platform }) => {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login(platform);
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
      disabled={isLoading}
    >
      <Mail className="mr-2 h-4 w-4" />
      {isLoading ? 'Connecting...' : `Continue with ${platform === 'gmail' ? 'Gmail' : 'Outlook'}`}
    </Button>
  );
};
