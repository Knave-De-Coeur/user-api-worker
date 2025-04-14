// scripts/setup.ts
import { execSync } from 'child_process'
import path from 'path'

// Replace with your D1 binding name as per wrangler.toml
const D1_NAME = 'D1'

const setupSQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
DELETE FROM users;
`

const rootDir = path.resolve(__dirname, '..')

try {
	console.log('🔧 Running D1 setup...')
	execSync(`echo "${setupSQL}" | npx wrangler d1 execute ${D1_NAME} --local`, {
		stdio: 'inherit',
		cwd: rootDir
	})
	console.log('✅ D1 ready')
} catch (err) {
	console.error('❌ Error running D1 setup:', err)
}
