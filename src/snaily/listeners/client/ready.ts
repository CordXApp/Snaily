import { ActivityType } from "discord.js";
import EventBase from "../../schemas/Listeners";
import type Snaily from "../../client";

export default class ReadyListener extends EventBase {
    constructor() {
        super({ name: "ready", once: true });
    }

    public async execute(client: Snaily) {

        //await client.manager.init();

        await client.server({ client });

        client.restApi.registerSlashCommands()

        client.logs.info(`Logged in as ${client.user?.tag}!`);

        client?.user?.setStatus('dnd');

        client?.user?.setActivity({
            name: 'Watching for error reports 🚨',
            type: ActivityType.Custom,
        });
    }
}