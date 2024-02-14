import type { CacheType, ChatInputCommandInteraction } from "discord.js"
import { SlashBase } from "../../schemas/Commands";
import type Snaily from "../../client";

export default class About extends SlashBase {
    constructor() {
        super({
            name: "about",
            description: "Some information about the bot.",
            usage: "/about",
            example: "/about",
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

        if (!stats.success) return interaction.reply({
            embeds: [
                new client.embeds({
                    title: 'Whoops, that did not go as planned!',
                    description: `Sorry chief, seems i am unable to fetch the statistics at this time, please try again later and if the issue persists ill have to call the developers to fix me up!\n\nYou can find some basic statistics below 👇👇👇`,
                    color: client.config.colors.error,
                })
            ]
        });

        const total = stats.data ? `\`${stats.data.total}\` reports.` : "0 reports.";
        const open = stats.data ? `\`${stats.data.open}\` reports.` : "0 reports.";
        const investigating = stats.data ? `\`${stats.data.investigating}\` reports.` : "0 reports.";
        const resolved = stats.data ? `\`${stats.data.resolved}\` reports.` : "0 reports.";
        const ignored = stats.data ? `\`${stats.data.ignored}\` reports.` : "0 reports.";
        const duplicate = stats.data ? `\`${stats.data.duplicate}\` reports.` : "0 reports.";
        const notBug = stats.data ? `\`${stats.data.not_a_bug}\` reports.` : "0 reports.";
        const moreInfo = stats.data ? `\`${stats.data.need_more_info}\` reports.` : "0 reports.";
        const closed = stats.data ? `\`${stats.data.closed}\` reports.` : "0 reports.";




        return interaction.reply({
            embeds: [
                new client.embeds({
                    title: 'About Snaily',
                    description: `Well hello there <@!${interaction.user.id}>, my name is Snaily, and i am a custom bot/system made to handle all Errors and Reports within the CordX Services. Here\'s some basic stats!`,
                    color: client.config.colors.base,
                    fields: [
                        {
                            name: '📂 Open',
                            value: open,
                            inline: true
                        },
                        {
                            name: '🔍 Investigating',
                            value: investigating,
                            inline: true
                        },
                        {
                            name: '✅ Resolved',
                            value: resolved,
                            inline: true
                        },
                        {
                            name: '🤫 Ignored',
                            value: ignored,
                            inline: true
                        },
                        {
                            name: '🔁 Duplicate',
                            value: duplicate,
                            inline: true
                        },
                        {
                            name: '🚫 Not a Bug',
                            value: notBug,
                            inline: true
                        },
                        {
                            name: '🔍 Need More Info',
                            value: moreInfo,
                            inline: true
                        },
                        {
                            name: '🔒 Closed',
                            value: closed,
                            inline: true
                        },
                        {
                            name: '📊 Total',
                            value: total,
                            inline: true
                        }
                    ]
                })
            ]
        })
    }
}