import { Router } from "../../../types/fastify/server.types";
import { ReportServices } from "../../services/main.service";

const home: Router = {
    url: '/reports/create',
    method: 'POST',
    handler: ReportServices.CreateReport.reqHandler,
    preHandler: ReportServices.CreateReport.preHandler
}

export const BaseRoutes: any = [home];