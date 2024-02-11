import "dotenv/config";

import cors from "@fastify/cors";
import { Logger } from "../snaily/utils/Logger";
import { Routes } from "./router/router";
import { Client } from "discord.js";
import fastify from "fastify";
import { config } from "../cfg";

export async function server({ client }: any) {
    const app = fastify({ logger: false });
    const logs = new Logger('[Snaily:API]:');

    app.register(cors, {
        origin: ['*'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        preflight: true,
        strictPreflight: true,
    });

    Routes.forEach((route) => app.route(route));

    app.addHook("preHandler", (req, res, done) => {

        req.client = client;

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header("X-Powered-By", "CordX");

        done();
    });

    app.setNotFoundHandler((req, res) => {
        res.status(404).send({
            message: "Whoops, that route does not exist.",
        })
    })

    app.setErrorHandler((error, req, res) => {
        res.status(500).send({
            message: "Whoops, something went wrong.",
        })
    })

    app.ready(err => {
        if (err) throw err;
    })

    const start = async (): Promise<void> => {
        try {
            app.listen({
                port: parseInt(config.server.port as string),
                host: config.server.host as string,
            })

            logs.ready(`Server is ready at: ${config.server.host}:${config.server.port}`);

        } catch (err: any) {
            logs.error(`Server failed to start: ${err.stack}`)
            process.exit(1);
        }
    }

    start();
}

declare module "fastify" {
    export interface FastifyRequest {
        client: any;
    }
}