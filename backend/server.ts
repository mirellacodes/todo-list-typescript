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
};

let tasks: Task[] = [];

app.get("/tasks", (_, res) => res.json(tasks));

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  const newTask = { id: uuidv4(), title };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  tasks = tasks.map((task) => (task.id === id ? { ...task, title } : task));
  res.json({ id, title });
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
