import express, { Request } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { initDatabase, db } from "./db";

// Extend Express Request interface to include sessionId
interface AuthenticatedRequest extends Request {
  sessionId: string;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to get session ID from request
const getSessionId = (req: Request): string => {
  const sessionId = req.headers['x-session-id'] as string;
  if (!sessionId) {
    throw new Error('Session ID is required in x-session-id header');
  }
  return sessionId;
};

// Root route for health check
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

app.get("/tasks", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const tasks = await db.getAllTasks(sessionId);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    if (error instanceof Error && error.message.includes('Session ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    
    const id = uuidv4();
    const newTask = await db.createTask(id, sessionId, title);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error instanceof Error && error.message.includes('Session ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    
    const task = await db.getTaskById(id, sessionId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await db.updateTask(id, sessionId, title);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error instanceof Error && error.message.includes('Session ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
});

app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { id } = req.params;
    const task = await db.getTaskById(id, sessionId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await db.toggleTask(id, sessionId);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    if (error instanceof Error && error.message.includes('Session ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to toggle task' });
    }
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { id } = req.params;
    const task = await db.getTaskById(id, sessionId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await db.deleteTask(id, sessionId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error instanceof Error && error.message.includes('Session ID')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete task' });
    }
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
