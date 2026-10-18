CREATE TABLE IF NOT EXISTS portfolio (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_name TEXT NOT NULL CHECK(length(trim(owner_name)) BETWEEN 1 AND 120),
  project_title TEXT NOT NULL CHECK(length(trim(project_title)) BETWEEN 1 AND 150),
  description TEXT NOT NULL CHECK(length(trim(description)) BETWEEN 1 AND 2000),
  skill TEXT NOT NULL CHECK(length(trim(skill)) BETWEEN 1 AND 100),
  status TEXT NOT NULL CHECK(status IN ('Planned', 'In progress', 'Completed')),
  project_year INTEGER NOT NULL CHECK(project_year BETWEEN 2000 AND 2100),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
