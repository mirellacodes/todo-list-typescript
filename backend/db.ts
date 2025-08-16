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
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
  // Get all tasks
  getAllTasks: async () => {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  },

  // Create a new task
  createTask: async (id: string, title: string) => {
    const result = await pool.query(
      'INSERT INTO tasks (id, title) VALUES ($1, $2) RETURNING *',
      [id, title]
    );
    return result.rows[0];
  },

  // Update task title
  updateTask: async (id: string, title: string) => {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [title, id]
    );
    return result.rows[0];
  },

  // Toggle task completion
  toggleTask: async (id: string) => {
    const result = await pool.query(
      'UPDATE tasks SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  // Delete a task
  deleteTask: async (id: string) => {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  },

  // Get task by ID
  getTaskById: async (id: string) => {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
  }
};

export default pool;
