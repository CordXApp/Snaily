import { FastifyRequest, FastifyReply } from 'fastify';
import { Body, ValidStates, ValidTypes } from '../../../types/fastify/reports/create.types';

/**
 * Create report pre-handler.
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 * @returns {Promise<void>}
 */
const preHandler = async (req: FastifyRequest, res: FastifyReply) => {

    if (req.method !== 'POST') return res.status(405).send({
        status: '[SNAILY:METHOD_NOT_ALLOWED]',
        message: "This route only accepts POST requests."
    })

    const { authorization } = req.headers;

    const body = req.body as Body;

    if (!authorization) return res.status(401).send({
        status: '[SNAILY:UNAUTHORIZED]',
        message: "Please provide a valid authorization header."
    });

    if (!body) return res.status(400).send({
        status: '[SNAILY:BAD_REQUEST]',
        message: "Please provide a valid request body."
    });

    if (!ValidTypes.includes(body.type)) return res.status(400).send({
        status: '[SNAILY:BAD_REQUEST]',
        message: "Please provide a valid type for the report, should be one of the types listed below.",
        valid: ValidTypes
    });
};

/**
 * Create report request handler.
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 * @returns {Promise<void>}
 */
const reqHandler = async (req: FastifyRequest, res: FastifyReply) => {
    const body = req.body as Body;

    const message = body.message ? body.message : body.error.message;

    const report = await req.client.manager.createReport(message, {
        type: body.type,
        info: body.info,
        error: body.error,
        status: body.status,
        support: body.support,
        reporter: body.reporter
    })

    if (!report.success) return res.status(500).send({
        status: '[SNAILY:ERROR]',
        message: report.message
    });

    return res.status(201).send({
        status: '[SNAILY:CREATED]',
        message: "Report has been created successfully.",
        report: report.report
    });
};

export const CreateReport = { preHandler, reqHandler };