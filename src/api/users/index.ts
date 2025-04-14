import { OpenAPIRoute } from 'chanfana'
import { CreateUser, GetUser, UpdateUser, DeleteUser } from './endpoints';

// TODO: fix issue where endpoints aren't being registered and crash when called.
export const getRoutesApi = () => [
	// new CreateUser(),
	// new GetUser(),
	// new UpdateUser(),
	// new DeleteUser()
	CreateUser, GetUser, UpdateUser, DeleteUser
]
