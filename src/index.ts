import { Hono } from 'hono'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { getRoutesApi } from './api/users';
import { RouteManager } from './helpers/RouteManager';

type Bindings = {
	R2: R2Bucket,
	D1: D1Database,
	KV: KVNamespace,
	AUTH_KEY_SECRET: string,
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()
const routes = new RouteManager(getRoutesApi())

// Home page route
app.get('/', (c) => {
	return c.text('Welcome to the User API Service!')
})

routes.registerPaths(app)

app.doc('/docs', {
	openapi: '3.1.0',
	info: {
		title: 'User CRUD API',
		version: '1.0.0',
	},
})

app.get('/openapi.json', (c) => c.json(app.openapi))
app.get('/docs-ui', swaggerUI({ url: '/openapi.json' }))

export default app
