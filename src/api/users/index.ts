import { CreateUser, GetUser, UpdateUser, DeleteUser } from './endpoints';
import { OpenAPIRoute, RouteOptions } from 'chanfana';

export function getRoutesApi(): (new (params: RouteOptions) => OpenAPIRoute)[]{
	return [CreateUser, GetUser, UpdateUser, DeleteUser]
}
