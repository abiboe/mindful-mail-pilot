
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/types';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  getTasksByEmailId
} from '@/services/taskService';
import { toast } from 'sonner';

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  // Fetch all tasks
  const { 
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
  
  // Add new task
  const { mutate: addTask } = useMutation({
    mutationFn: (newTask: Omit<Task, 'id' | 'createdAt'>) => createTask(newTask),
    onSuccess: (newTask) => {
      // Update tasks cache
      queryClient.setQueryData(['tasks'], (oldData: Task[] = []) => {
        return [...oldData, newTask];
      });
      toast.success('Task added successfully');
    },
    onError: () => {
      toast.error('Failed to add task');
    }
  });
  
  // Complete/update task
  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>> }) => 
      updateTask(id, updates),
    onSuccess: (updatedTask) => {
      // Update tasks cache
      queryClient.setQueryData(['tasks'], (oldData: Task[] = []) => {
        return oldData.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
      });
      
      // Update single task cache if it exists
      queryClient.setQueryData(['task', updatedTask.id], updatedTask);
      
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });
  
  // Remove task
  const { mutate: removeTask } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      // Update tasks cache
      queryClient.setQueryData(['tasks'], (oldData: Task[] = []) => {
        return oldData.filter(task => task.id !== id);
      });
      
      // Remove from single task cache
      queryClient.removeQueries({ queryKey: ['task', id] });
      
      toast.success('Task removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove task');
    }
  });
  
  // Get due today tasks
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate.getTime() === today.getTime() && !task.completed;
  });
  
  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today && !task.completed;
  });
  
  return {
    tasks,
    isLoadingTasks,
    tasksError,
    refetchTasks,
    addTask,
    updateTask: updateTaskMutation,
    removeTask,
    todayTasks,
    overdueTasks,
  };
};

export const useTasksByEmailId = (emailId: string | undefined) => {
  // Fetch tasks by email ID
  const { 
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', 'email', emailId],
    queryFn: () => emailId ? getTasksByEmailId(emailId) : [],
    enabled: !!emailId,
  });
  
  return {
    tasks,
    isLoading,
    error,
  };
};

export const useTask = (taskId: string | undefined) => {
  // Get single task
  const { 
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskId ? getTaskById(taskId) : null,
    enabled: !!taskId,
  });
  
  return {
    task,
    isLoading,
    error,
  };
};
