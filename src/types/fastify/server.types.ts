export interface Router {
    url: string;
    method: string;
    schema?: any;
    preHandler?: any;
    handler: any;
    config?: any;
}

export interface RouteSchema {
    summary: string;
    description: string;
    security?: any[];
    response: any;
    params?: any;
    querystring?: any;
    body?: any;
    tags: string[];
}