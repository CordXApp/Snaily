import { join } from "node:path"
import { SnailyEmbed } from "./utils/Embeds"
import { Client, ClientOptions, Collection } from "discord.js"
import type { IConfig } from "../types/client/client.types"
import { SnailyClient } from "./handlers/Snaily"
import CommandManager from "./handlers/Commands"
import EventManager from "./handlers/Listeners"
import RestManager from "./handlers/RestClient"
import { SnailyModal } from "./utils/Popup"
import { server } from "../fastify/server";
import { Logger } from "./utils/Logger"
import { config } from "../cfg"

class Snaily extends Client {
    public cooldown = new Collection<string, Collection<string, number>>()
    public manager: SnailyClient = new SnailyClient(this, process.env.MONGO!)
    public commands: CommandManager = new CommandManager(this)
    public events: EventManager = new EventManager(this)
    public restApi: RestManager = new RestManager(this)
    public modal: SnailyModal = new SnailyModal()
    public logs: Logger = new Logger("[Snaily]:")
    public server: any = server
    public config: IConfig = config
    public embeds: any = SnailyEmbed

    constructor(options: ClientOptions) {
        super(options)
        this.init()
    }

    public async authenticate(token: string): Promise<void> {
        try {
            this.logs.info(
                `Initializing client with token: ${token.substring(0, 5)}.****`,
            )
            await this.login(token)
        } catch (e: any) {
            this.logs.error(`Error initializing client: ${e.stack}`)
        }
    }

    private init(): void {
        this.commands.load(join(__dirname, "./commands/"))
        this.events.load(join(__dirname, "./listeners/"))
    }
}

export default Snaily