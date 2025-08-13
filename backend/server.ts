import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

let tasks: Task[] = [];

app.get("/tasks", (_, res) => res.json(tasks));

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  const newTask = { id: uuidv4(), title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }
  
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.title = title;
  res.json(task);
});

app.patch("/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const task = tasks.find(task => task.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.completed = !task.completed;
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
