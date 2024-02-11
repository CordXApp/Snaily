import { Router } from "../../../types/fastify/server.types";
import { BaseServices } from "../../services/main.service";

const home: Router = {
    url: '/',
    method: 'GET',
    handler: BaseServices.home
}

const stats: Router = {
    url: '/stats',
    method: 'GET',
    handler: BaseServices.stats
}

export const BaseRoutes: any = [home, stats];