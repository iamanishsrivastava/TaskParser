-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date TIMESTAMP NULL,
  task_label TEXT,
  task_status TEXT CHECK (task_status IN ('todo', 'in-progress', 'done')) DEFAULT 'todo',
  task_priority TEXT CHECK (task_priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  description TEXT
);  

-- Task Pattern table
CREATE TABLE IF NOT EXISTS task_pattern (
  id SERIAL PRIMARY KEY,
  pattern TEXT NOT NULL,
  default_due_time TEXT,
  default_priority TEXT CHECK (default_priority IN ('low', 'medium', 'high', 'urgent'))
);

-- TODO: Add a table for logging parser results
-- Parser Logs table
-- CREATE TABLE parser_logs (
--   id SERIAL PRIMARY KEY,
--   input TEXT,
--   title TEXT,
--   used_fallback BOOLEAN,
--   used_kb_match BOOLEAN,
--   missing_fields TEXT[], -- ['due_date', 'priority']
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );