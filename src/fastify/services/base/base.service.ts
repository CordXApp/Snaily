import { FastifyRequest, FastifyReply } from 'fastify';

const handler = async (req: FastifyRequest, res: FastifyReply) => {

    return res.status(200).send({
        message: 'Hey there, welcome to Snaily.',
        support: 'https://cordx.lol/discord',
        code: 200
    })
};

export const home = handler;