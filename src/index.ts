import { OpenAPIHono } from '@hono/zod-openapi'
import { getRoutesApi } from './api/users';
import { RouteManager } from './helpers/RouteManager';
import { fromHono, HonoOpenAPIRouterType } from 'chanfana';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export type MyBindings = {
	R2: R2Bucket,
	D1: D1Database,
	KV: KVNamespace,
	AUTH_KEY_SECRET: string,
}

const app = new Hono<{ Bindings: MyBindings }>()
app.use("*", cors())

const routes = new RouteManager(getRoutesApi())

// Home page route
app.get('/', (c) => {
	return c.text('Welcome to the User API Service!')
})
// Setup OpenAPI registry
const openapi : HonoOpenAPIRouterType<{ Bindings: MyBindings }> = fromHono(app, {
	docs_url: "/docs/",
	schema: {
		security: [
			{
				BearerAuth: [],
			},
		],
	}
})

openapi.registry.registerComponent(
	'securitySchemes',
	'BearerAuth',
	{
		type: 'http',
		scheme: 'bearer',
	},
)

// Register OpenAPI endpoints
openapi.get("/docs", (c) => {
	return c.redirect('/docs/')
})

routes.registerPaths(openapi)

export default app
