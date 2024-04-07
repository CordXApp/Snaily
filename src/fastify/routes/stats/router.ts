module.exports = async (fastify: any) => {
    fastify.get("/", async (req: any, res: any) => {

        const stats = await req.client.manager.getStatistics()

        return res.status(200).send({
            open: stats.data.open ? stats.data.open + ' open reports' : '0 open reports',
            closed: stats.data.closed ? stats.data.closed + ' closed reports' : '0 closed reports',
            investigating: stats.data.investigating ? stats.data.investigating + ' investigating reports' : '0 investigating reports',
            duplicate: stats.data.duplicate ? stats.data.duplicate + ' duplicate reports' : '0 duplicate reports',
            ignored: stats.data.ignored ? stats.data.ignored + ' ignored reports' : '0 ignored reports',
            resolved: stats.data.resolved ? stats.data.resolved + ' resolved reports' : '0 resolved reports',
            total: stats.data.total ? stats.data.total + ' total reports' : '0 total reports',
        })
    })
}