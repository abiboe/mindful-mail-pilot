
import React, { useState } from 'react';
import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { Calendar, Clock } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  showActions?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, showActions = false }) => {
  const { updateTask, removeTask } = useTasks();
  
  const handleCompleteTask = (task: Task) => {
    updateTask({
      id: task.id,
      updates: { completed: !task.completed }
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
  };
  
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-priority-high';
      case 'medium':
        return 'bg-priority-medium';
      case 'low':
        return 'bg-priority-low';
      default:
        return 'bg-gray-400';
    }
  };
  
  const getDueDateClass = (dueDate?: string) => {
    if (!dueDate) return '';
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return 'text-red-600';
    }
    if (isToday(date)) {
      return 'text-orange-600';
    }
    return '';
  };
  
  const renderDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const formattedDate = format(date, 'MMM d');
    const dateClass = getDueDateClass(dueDate);
    
    return (
      <div className={`flex items-center gap-1 text-xs ${dateClass}`}>
        <Calendar className="h-3 w-3" />
        <span>{formattedDate}</span>
      </div>
    );
  };
  
  if (tasks.length === 0) {
    return (
      <div className="flex h-20 items-center justify-center">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-start justify-between rounded-md border p-3 ${
            task.completed ? 'bg-muted/40' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleCompleteTask(task)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}
                  aria-label={`Priority: ${task.priority}`}
                />
                <p
                  className={`font-medium ${
                    task.completed ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {task.title}
                </p>
              </div>
              {task.dueDate && (
                <div>{renderDueDate(task.dueDate)}</div>
              )}
            </div>
          </div>
          
          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleDeleteTask(task.id)}
            >
              &times;
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
