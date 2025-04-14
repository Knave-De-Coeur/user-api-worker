// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { readFileSync } from 'fs'
import { parse } from 'toml'
import path from 'path'

const tomlPath = path.resolve(__dirname, './wrangler.toml')
console.log("tomlPath", tomlPath)
let defineEnv = {}
try {
	const toml = parse(readFileSync(tomlPath, 'utf8'))
	defineEnv = toml.vars ?? {}
} catch (err) {
	console.warn('⚠️ Could not parse wrangler.toml:', err)
}

export default defineConfig({
	test: {
		globals: true,

		// 🌐 Use `node` environment by default (for E2E tests)
		environment: 'node',

		// 🧠 Custom overrides: use `happy-dom` or `edge-runtime` only if needed
		environmentMatchGlobs: [
			['test/**/*.e2e.test.ts', 'node'],
			['test/**/*.chanfana.test.ts', 'node'], // could be 'edge-runtime' or 'hono' too if needed
		],
	},
})
