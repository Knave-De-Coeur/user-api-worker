-- Migration number: 0001 	 2025-04-14T11:14:51.971Z
CREATE TABLE IF NOT EXISTS users (
									 id TEXT PRIMARY KEY,
									 name TEXT NOT NULL,
									 email TEXT NOT NULL
);
DELETE FROM users;
