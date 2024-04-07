module.exports = async (fastify: any) => {
    fastify.post("/", async (req: any, res: any) => {

        if (req.method !== 'POST') return res.status(405).send({
            state: '[SNAILY:METHOD_NOT_ALLOWED]',
            message: 'Whoops, requests to this endpoint must be POST requests.',
            status: 405
        });

        if (!req.body) return res.status(400).send({
            state: '[SNAILY:BAD_REQUEST]',
            message: 'Whoops, you must provide a JSON body in your request.',
            status: 400
        });

        if (!req.body.info) return res.status(400).send({
            state: '[SNAILY:BAD_REQUEST]',
            message: 'Whoops, you must provide a `info` field in your request body.',
            status: 400
        });

        if (!req.body.type) return res.status(400).send({
            state: '[SNAILY:BAD_REQUEST]',
            message: 'Whoops, you must provide a `type` field in your request body.',
            status: 400
        });

        if (!req.body.status) return res.status(400).send({
            state: '[SNAILY:BAD_REQUEST]',
            message: 'Whoops, you must provide a `status` field in your request body.',
            status: 400
        });

        if (!req.body.message) return res.status(400).send({
            state: '[SNAILY:BAD_REQUEST]',
            message: 'Whoops, you must provide a `message` field in your request body.',
            status: 400
        });

        const report = await req.client.manager.createReport(req.body);

        if (!report.state) return res.status(500).send({
            state: '[SNAILY:INTERNAL_SERVER_ERROR]',
            message: 'Whoops, something went wrong while creating the report.',
            status: 500
        });

        return res.status(201).send({
            state: '[SNAILY:CREATED]',
            message: 'Report has been created successfully.',
            status: 201
        })
    })
}