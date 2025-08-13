import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import TaskList from './components/TaskList';
import { GlobalStyle, NeonButton, Input } from './styles';
import type { Task } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get<Task[]>('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await axios.post<Task>('http://localhost:5000/tasks', { title: newTask });
    setTasks([...tasks, res.data]);
    setNewTask('');
  };

  const deleteTask = async (id: string) => {
    console.log('Delete task called with id:', id);
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.put<Task>(`http://localhost:5000/tasks/${id}`, { title: newTitle });
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
      console.log('Task edited successfully');
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Toaster position="top-center" />
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h1>📝 To-Do List</h1>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <Input
            placeholder="Add a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <NeonButton onClick={addTask}>Add</NeonButton>
        </div>
        <TaskList tasks={tasks} setTasks={setTasks} onDelete={deleteTask} onEdit={editTask} />
      </div>
    </>
  );
};

export default App;
