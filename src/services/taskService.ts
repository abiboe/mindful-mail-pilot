
import { Task } from '@/types';

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review quarterly report draft',
    completed: false,
    priority: 'medium',
    dueDate: '2025-04-21',
    emailId: 'email-1',
    createdAt: '2025-04-20T10:35:00Z',
  },
  {
    id: 'task-2',
    title: 'Complete user interview analysis',
    completed: false,
    priority: 'high',
    dueDate: '2025-04-23',
    emailId: 'email-2',
    createdAt: '2025-04-19T16:50:00Z',
  },
  {
    id: 'task-3',
    title: 'Provide marketing team with feature details',
    completed: false,
    priority: 'medium',
    dueDate: '2025-04-24',
    emailId: 'email-3',
    createdAt: '2025-04-18T10:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Update benefits selections',
    completed: false,
    priority: 'low',
    dueDate: '2025-04-25',
    emailId: 'email-4',
    createdAt: '2025-04-18T14:30:00Z',
  },
  {
    id: 'task-5',
    title: 'Respond to collaboration proposal',
    completed: false,
    priority: 'high',
    dueDate: '2025-04-22',
    emailId: 'email-5',
    createdAt: '2025-04-17T11:15:00Z',
  },
];

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockTasks;
};

// Get task by ID
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockTasks.find(task => task.id === id);
};

// Get tasks by email ID
export const getTasksByEmailId = async (emailId: string): Promise<Task[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockTasks.filter(task => task.emailId === emailId);
};

// Create a new task
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newTask: Task = {
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...task,
  };
  
  // In a real implementation, we would add to the backend
  mockTasks.push(newTask);
  
  return newTask;
};

// Update task
export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...updates,
  };
  
  // In a real implementation, we would update the backend
  mockTasks[taskIndex] = updatedTask;
  
  return updatedTask;
};

// Delete task
export const deleteTask = async (id: string): Promise<boolean> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const taskIndex = mockTasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  // In a real implementation, we would delete from the backend
  mockTasks.splice(taskIndex, 1);
  
  return true;
};
