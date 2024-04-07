import type { CacheType, ChatInputCommandInteraction } from "discord.js"
import { SlashBase } from "../../schemas/Commands";
import type Snaily from "../../client";

export default class Stats extends SlashBase {
    constructor() {
        super({
            name: "source",
            description: "Get a link to our source code on GitHub",
            usage: "/source",
            example: "/source",
            category: "Info",
            cooldown: 5,
            staff: false,
            user: [],
            client: [],
        })
    }

    public async execute(
        client: Snaily,
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<any> {

        const repo = await client.manager.getRepoInfo();

        return interaction.reply({
            embeds: [
                new client.embeds({
                    title: 'Snaily: report statistics',
                    description: `Snaily is 100% open-source and welcomes contributions from the community. You can find the source code on [GitHub](${repo.data.url})`,
                    color: client.config.colors.base
                })
            ]
        })
    }
}