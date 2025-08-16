import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { initDatabase, db } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route for health check - URGENT FIX
app.get("/", (_, res) => {
  res.json({ 
    message: "🚀 Todo List API is running!", 
    status: "healthy",
    endpoints: {
      tasks: "/tasks",
      health: "/"
    }
  });
});



type Task = {
  id: string;
  title: string;
  completed: boolean;
};

app.get("/tasks", async (_, res) => {
  try {
    const tasks = await db.getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    
    const id = uuidv4();
    const newTask = await db.createTask(id, title);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    
    const task = await db.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await db.updateTask(id, title);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await db.toggleTask(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await db.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Initialize database for serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    try {
      await initDatabase();
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  });
} else {
  // For Vercel serverless, initialize database on first request
  initDatabase().catch(console.error);
}

// Export the app for Vercel serverless
export default app;
