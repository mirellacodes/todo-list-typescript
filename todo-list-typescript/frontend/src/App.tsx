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
    toast((t) => (
      <span>
        Confirm delete?
        <NeonButton
          onClick={async () => {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            setTasks(tasks.filter((t) => t.id !== id));
            toast.dismiss(t.id);
          }}
        >
          Yes
        </NeonButton>
        <NeonButton onClick={() => toast.dismiss(t.id)}>Cancel</NeonButton>
      </span>
    ));
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
        <TaskList tasks={tasks} setTasks={setTasks} onDelete={deleteTask} />
      </div>
    </>
  );
};

export default App;
