import { env } from 'hono/adapter'
import { OpenAPIRoute } from 'chanfana';
import { Context } from 'hono';
import { RouteAuthType, RouteInfo, RouteMethod } from '../../helpers/RouteManager';
import { UserSchema } from '../../types';
import { z } from 'zod';

export class GetUser extends OpenAPIRoute {
	method = 'get'
	path = '/users/:id'
	responses = {
		200: { description: 'User found', content: { 'application/json': UserSchema } },
		404: { description: 'Not found' }
	}

	async handle(c : Context) {
		const { D1 } = env(c)
		const id = c.req.param('id')
		const user = await D1.prepare('SELECT * FROM users WHERE id = ?').bind(id).first()
		if (!user) return c.notFound()
		return c.json(user)
	}
	static route_info = {
		method: RouteMethod.GET,
		path: "/users/:id",
		authType: RouteAuthType.REQUIRED
	} as RouteInfo
}

export class CreateUser extends OpenAPIRoute {
	async handle(c : Context) {
		const data = await this.getValidatedData<typeof this.schema>()
		const { id, name, email } = data.body

		const { D1, KV } = env(c)
		await D1.prepare('INSERT INTO users (id, name, email) VALUES (?, ?, ?)').bind(id, name, email).run()
		await KV.put(`user:${id}`, JSON.stringify({ id, name, email }))
		return c.text('User created', 201)
	}

	schema = {
		tags: ["Users"],
		summary: "Create User",
		request: {
			body: {
				content: {
					"application/json": {
						schema: UserSchema
					}
				}
			}
		},
		responses: {
			"200": {
				description: "",
				content: {
					"application/text": {schema: UserSchema}
				}
			},
			"201": {
				description: "",
				content: {
					"application/text": {schema: z.string()}
				}
			}
		}
	}

	static route_info = {
		method: RouteMethod.POST,
		path: "/users",
		authType: RouteAuthType.REQUIRED
	} as RouteInfo
}

export class UpdateUser extends OpenAPIRoute {
	method = 'put'
	path = '/users/:id'
	requestBody = {
		content: {
			'application/json': {
				schema: UserSchema
			}
		}
	}
	responses = {
		200: { description: 'User updated' }
	}

	async handle(c : Context) {
		const { D1, KV } = env(c)
		const id = c.req.param('id')
		const { name, email } = await c.req.json()
		await D1.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').bind(name, email, id).run()
		await KV.put(`user:${id}`, JSON.stringify({ id, name, email }))
		return c.text('User updated')
	}
	static route_info = {
		method: RouteMethod.PUT,
		path: "/users/:id",
		authType: RouteAuthType.REQUIRED
	} as RouteInfo
}

export class DeleteUser extends OpenAPIRoute {
	method = 'delete'
	path = '/users/:id'
	responses = {
		200: { description: 'User deleted' }
	}

	async handle(c : Context) {
		const { D1, KV } = env(c)
		const id = c.req.param('id')
		await D1.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
		await KV.delete(`user:${id}`)
		return c.text('User deleted')
	}
	static route_info = {
		method: RouteMethod.DELETE,
		path: "/users/:id",
		authType: RouteAuthType.REQUIRED
	} as RouteInfo
}
