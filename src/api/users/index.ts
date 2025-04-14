import { CreateUser, GetUser, UpdateUser, DeleteUser } from './endpoints';

// TODO: fix issue where endpoints aren't being registered and crash when called.
export function getRoutesApi() {
	return [CreateUser, GetUser, UpdateUser, DeleteUser]
}
