// scripts/teardown.ts
import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import path from 'path'

// Replace with your bindings
const D1_NAME = 'D1'
const KV_BINDING = 'KV'

const cleanupSQL = `DELETE FROM users;`
const rootDir = path.resolve(__dirname, '..')

try {
	console.log('🧹 Clearing users table...')
	execSync(`echo "${cleanupSQL}" | npx wrangler d1 execute ${D1_NAME} --local`, {
		stdio: 'inherit',
		cwd: rootDir
	})
	console.log('✅ D1 cleared')
} catch (err) {
	console.error('❌ Failed to cleanup D1:', err)
}

// Clean up KV `user:*` keys
try {
	console.log('🧹 Cleaning KV...')
	const output = execSync(`npx wrangler kv:key list --binding=${KV_BINDING} --json`, {
		encoding: 'utf-8',
		cwd: rootDir
	})

	const keys = JSON.parse(output)
	const userKeys = keys
		.filter((k: any) => k.name.startsWith('user:'))
		.map((k: any) => k.name)

	if (userKeys.length > 0) {
		const kvBulkDelete = {
			deletes: userKeys
		}

		writeFileSync('./kv-deletes.json', JSON.stringify(kvBulkDelete, null, 2))
		execSync(`npx wrangler kv:bulk delete --binding=${KV_BINDING} kv-deletes.json`, {
			stdio: 'inherit',
			cwd: rootDir
		})
		unlinkSync('./kv-deletes.json')
		console.log('✅ KV cleaned')
	} else {
		console.log('⚠️ No user:* keys found in KV')
	}
} catch (err) {
	console.error('❌ Failed to cleanup KV:', err)
}
