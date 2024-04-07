module.exports = async (fastify: any) => {
    fastify.get("/", async (req: any, res: any) => {
        return res.status(200).send({
            message: 'Hey there, welcome to the Snaily API!',
            support: 'https://cordx.lol/discord',
            code: 200
        })
    })
}