import type { CacheType, ChatInputCommandInteraction } from "discord.js"
import { SlashBase } from "../../schemas/Commands";
import type Snaily from "../../client";

export default class Stats extends SlashBase {
    constructor() {
        super({
            name: "stats",
            description: "Report statistics",
            usage: "/stats",
            example: "/stats",
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

        const stats = await client.manager.getStatistics();

        if (!stats.state) return interaction.reply('Woah, something went wrong while fetching the statistics, please try again later.');

        return interaction.reply({
            embeds: [
                new client.embeds({
                    title: 'Snaily: report statistics',
                    description: `All the reports that are currently in our system.`,
                    color: client.config.colors.base,
                    fields: [
                        {
                            name: '📂 Open',
                            value: stats?.data?.open ? stats.data.open + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '🔍 Investigating',
                            value: stats?.data?.investigating ? stats.data.investigating + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '🤫 Ignored',
                            value: stats?.data?.ignored ? stats.data.ignored + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '🔁 Duplicate',
                            value: stats?.data?.duplicate ? stats.data.duplicate + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '🚫 Not a Bug',
                            value: stats?.data?.not_a_bug ? stats.data.not_a_bug + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '🔍 Need more Info',
                            value: stats?.data?.need_more_info ? stats.data.need_more_info + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '✅ Resolved',
                            value: stats?.data?.resolved ? stats.data.resolved + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '📂 Closed',
                            value: stats?.data?.closed ? stats.data.closed + ' reports' : '0 reports',
                            inline: true
                        },
                        {
                            name: '📊 Total',
                            value: stats?.data?.total ? stats.data.total + ' reports' : '0 reports',
                            inline: true
                        }
                    ]
                })
            ]
        })
    }
}