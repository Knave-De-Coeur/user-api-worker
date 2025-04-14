import { OpenAPIRoute } from 'chanfana'
import { CreateUser, GetUser, UpdateUser, DeleteUser } from './endpoints'

export const getRoutesApi = () => [
	// new CreateUser(),
	// new GetUser(),
	// new UpdateUser(),
	// new DeleteUser()
	CreateUser, GetUser, UpdateUser
]
