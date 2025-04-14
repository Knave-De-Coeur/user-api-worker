import { z } from 'zod';

export const UserSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	email: z.string(),
	password: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

// export {Context} from "hono"
// export {OpenAPIRoute} from "chanfana"
// export {z} from "zod"
// export {RouteManager, RouteInfo, RouteMethod, RouteAuthType} from "./helpers/RouteManager"
