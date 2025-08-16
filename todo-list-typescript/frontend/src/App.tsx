import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import TaskList from './components/TaskList';
import { GlobalStyle, NeonButton, Input } from './styles';
import type { Task } from './types';
import { API_ENDPOINTS, createApiConfig } from './config';
import { SessionManager } from './utils/sessionManager';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [animatingTasks, setAnimatingTasks] = useState<Set<string>>(new Set());
  const [sessionId] = useState(() => SessionManager.getSessionId());

  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>(API_ENDPOINTS.TASKS, createApiConfig(sessionId));
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.');
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      const res = await axios.post<Task>(API_ENDPOINTS.TASKS, { title: newTask }, createApiConfig(sessionId));
      setTasks([...tasks, res.data]);
      setNewTask('');
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task. Please try again.');
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    console.log('Delete task called with id:', id);
    try {
      await axios.delete(API_ENDPOINTS.TASK(id), createApiConfig(sessionId));
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success('Task deleted successfully!');
      console.log('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.put<Task>(API_ENDPOINTS.TASK(id), { title: newTitle }, createApiConfig(sessionId));
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      toast.success('Task updated successfully!');
      console.log('Task edited successfully');
    } catch (error) {
      toast.error('Failed to update task. Please try again.');
      console.error('Error editing task:', error);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      const res = await axios.patch<Task>(API_ENDPOINTS.TOGGLE_TASK(id), {}, createApiConfig(sessionId));
      
      // If task is completed and we're not showing completed tasks, trigger animation FIRST
      if (res.data.completed && !showCompleted) {
        setAnimatingTasks(prev => new Set(prev).add(id));
        
        // Wait a bit for the animation state to be set, then update tasks
        setTimeout(() => {
          setTasks(prevTasks => {
            const updatedTasks = prevTasks.map((t) => (t.id === id ? res.data : t));
            return updatedTasks;
          });
        }, 50);
        
        // Remove task from DOM after animation completes
        setTimeout(() => {
          setAnimatingTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }, 1250); // Slightly longer than animation duration (1.2s) to ensure smooth transition
              } else {
          // Normal task update without animation
          setTasks(prevTasks => {
            const updatedTasks = prevTasks.map((t) => (t.id === id ? res.data : t));
            return updatedTasks;
          });
        }
        
        const action = res.data.completed ? 'completed' : 'uncompleted';
        toast.success(`Task marked as ${action}!`);
      } catch (error) {
        toast.error('Failed to update task status. Please try again.');
        console.error('Error toggling task completion:', error);
      }
  };

  // Include animating tasks in filtered tasks to keep them visible during animation
  const filteredTasks = showCompleted 
    ? tasks 
    : tasks.filter(task => !task.completed || animatingTasks.has(task.id));

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Toaster position="top-center" />
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1>📝 To-Do List</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
          <div style={{ width: '24px' }}></div>
          <Input
            placeholder="Add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <NeonButton onClick={addTask}>Add</NeonButton>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          setTasks={setTasks} 
          onDelete={deleteTask} 
          onEdit={editTask}
          onToggleCompletion={toggleTaskCompletion}
          animatingTasks={animatingTasks}
        />
        
        {/* Session Info */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#666', 
          marginTop: '10px',
          fontFamily: 'monospace',
          padding: '10px',
          backgroundColor: '#1a1a1a',
          borderRadius: '5px',
          border: '1px solid #333'
        }}>
          🆔 Session: {sessionId.substring(0, 20)}...
          <br />
          <button 
            onClick={() => {
              const newSessionId = SessionManager.forceNewSession();
              window.location.reload(); // Reload to use new session
            }}
            style={{
              marginTop: '5px',
              padding: '5px 10px',
              fontSize: '10px',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            🔄 New Session
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="showCompleted"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="showCompleted" style={{ cursor: 'pointer', color: '#ccc' }}>
              Show completed tasks
            </label>
          </div>
          <div style={{ color: '#666', fontSize: '0.9rem', marginLeft: '1.5rem' }}>
            {tasks.filter(t => t.completed).length} of {tasks.length} completed
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
