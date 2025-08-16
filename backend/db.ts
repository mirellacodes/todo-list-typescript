import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database with tasks table
export const initDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Create tasks table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create index on session_id for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
    `);
    
    client.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Database operations
export const db = {
  // Get all tasks for a specific session
  getAllTasks: async (sessionId: string) => {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE session_id = $1 ORDER BY created_at DESC',
      [sessionId]
    );
    return result.rows;
  },

  // Create a new task
  createTask: async (id: string, sessionId: string, title: string) => {
    const result = await pool.query(
      'INSERT INTO tasks (id, session_id, title) VALUES ($1, $2, $3) RETURNING *',
      [id, sessionId, title]
    );
    return result.rows[0];
  },

  // Update task title
  updateTask: async (id: string, sessionId: string, title: string) => {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND session_id = $3 RETURNING *',
      [title, id, sessionId]
    );
    return result.rows[0];
  },

  // Toggle task completion
  toggleTask: async (id: string, sessionId: string) => {
    const result = await pool.query(
      'UPDATE tasks SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND session_id = $2 RETURNING *',
      [id, sessionId]
    );
    return result.rows[0];
  },

  // Delete a task
  deleteTask: async (id: string, sessionId: string) => {
    await pool.query('DELETE FROM tasks WHERE id = $1 AND session_id = $2', [id, sessionId]);
  },

  // Get task by ID (within session)
  getTaskById: async (id: string, sessionId: string) => {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND session_id = $2',
      [id, sessionId]
    );
    return result.rows[0];
  }
};

export default pool;
