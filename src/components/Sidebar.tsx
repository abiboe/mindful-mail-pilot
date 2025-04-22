
import React from 'react';
import { 
  Sidebar as SidebarContainer, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { 
  Inbox, Mail, Calendar, ListCheck, Star, 
  Clock, ArrowRight, Folder, User, BookOpen 
} from 'lucide-react';
import { useEmails } from '@/hooks/useEmails';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  activeItem?: string;
  onSelectItem: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'inbox', onSelectItem }) => {
  const { unreadCount } = useEmails();
  const navigate = useNavigate();
  const location = useLocation();

  const folderItems = [
    { id: 'work', label: 'Work', icon: Folder },
    { id: 'personal', label: 'Personal', icon: Folder },
    { id: 'archive', label: 'Archive', icon: Folder },
  ];

  const mainItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'tasks', label: 'Tasks', icon: ListCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { 
      id: 'message-reader', 
      label: 'Message Reader', 
      icon: BookOpen,
      action: () => navigate('/message-reader')
    },
  ];

  const handleClick = (item: string) => {
    const menuItem = mainItems.find(i => i.id === item);
    if (menuItem?.action) {
      menuItem.action();
    } else {
      onSelectItem(item);
    }
  };

  // Determine if message-reader is active based on URL path
  const isMessageReaderActive = location.pathname === '/message-reader';

  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mail</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    className={
                      (activeItem === item.id || 
                       (item.id === 'message-reader' && isMessageReaderActive)) 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                        : ''
                    }
                    onClick={() => handleClick(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <Badge 
                        variant="outline" 
                        className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground"
                      >
                        {item.count}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folderItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    className={activeItem === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                    onClick={() => handleClick(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};
