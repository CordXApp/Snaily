import { FastifyRequest, FastifyReply } from 'fastify';

const handler = async (req: FastifyRequest, res: FastifyReply) => {
    const stats = await req.client.manager.getStatistics();

    if (!stats.success) return res.status(500).send({
        message: stats.message,
        data: null,
    });

    return res.status(200).send({
        open: stats.data.open,
        investigating: stats.data.investigating,
        resolved: stats.data.resolved,
        ignored: stats.data.ignored,
        duplicate: stats.data.duplicate,
        not_a_bug: stats.data.not_a_bug,
        need_more_info: stats.data.need_more_info,
        closed: stats.data.closed,
        total: stats.data.total,
    })
};



export const stats = handler;