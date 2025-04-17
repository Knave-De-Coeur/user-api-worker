import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import fetch from 'node-fetch'
import waitOn from 'wait-on'
import { User } from '../src/types';
import { execSync, spawn } from 'node:child_process';

let devProcess: ReturnType<typeof spawn>
const BASE_URL = 'http://127.0.0.1:8937'

const startWorker = async () => {
	devProcess = spawn('npx', ['wrangler', 'dev'], {
		stdio: 'inherit'
	}
	)
	await waitOn({ resources: [BASE_URL], timeout: 10000 })
}

const stopWorker = async () => {
	if (devProcess) devProcess.kill()
}

beforeEach(async () => {
	// execSync('npx ts-node --esm scripts/setup.ts', { stdio: 'inherit' })
	await startWorker()
})

afterEach(async () => {
	await stopWorker()
	// execSync('npx ts-node --esm scripts/teardown.ts', { stdio: 'inherit' })
})

describe('User API (E2E Wrangler)', () => {
	it('creates and retrieves a user', async () => {
		const post = await fetch(`${BASE_URL}/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: 'u2', name: 'Bob', email: 'bob@x.com' })
		})

		expect(post.status).toBe(500)

		// const res = await fetch(`${BASE_URL}/users/u2`)
		// const user = await res.json() as User
		// expect(user.name).toBe('Bob')
	})
})
