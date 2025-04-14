
export enum RouteAuthType {
	NONE = 'none',
	OPTIONAL = 'optional',
	REQUIRED = 'required'
}

export enum RouteMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH'
}

export type RouteInfo = {
	method: RouteMethod
	path: string
	authType: RouteAuthType
}

export class RouteManager {

	private readonly _routes: any[]  = []

	constructor(routes: any) {
		this._routes = routes
	}

	authOptionalPaths() {
		const paths = new Array<string>()
		if (this._routes.length > 0) {
			this._routes
				.filter(r => r.route_info.authType === RouteAuthType.OPTIONAL)
				.forEach(r => paths.push(r.route_info.path))
		}
		return paths
	}

	publicPaths(): string[] {
		const paths = new Array<string>()
		if (this._routes.length > 0) {
			this._routes
				.filter(r  => r.route_info.authType === RouteAuthType.NONE)
				.forEach(r => paths.push(r.route_info.path))
		}
		return paths
	}

	registerPaths(openapi : any) {
		if (this._routes.length > 0) {
			this._routes.forEach(r => {
				switch(r.route_info.method) {
					case RouteMethod.GET:
						openapi.get(r.route_info.path, r)
						break
					case RouteMethod.POST:
						openapi.post(r.route_info.path, r)
						break
					case RouteMethod.PUT:
						openapi.put(r.route_info.path, r)
						break
					case RouteMethod.DELETE:
						openapi.delete(r.route_info.path, r)
						break
					case RouteMethod.PATCH:
						openapi.patch(r.route_info.path, r)
						break
					default:
						throw new Error(`unsupport route method ${r.route_info.method} ${r.route_info.path}`)
				}
			})
		}
	}
}
