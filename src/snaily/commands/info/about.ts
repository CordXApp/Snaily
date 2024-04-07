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

        return interaction.reply({
            embeds: [
                new client.embeds({
                    title: 'About Snaily',
                    description: `Well hello there <@${interaction.user.id}>, my name is Snaily and i am a custom bot/system made to help you handle, manage and automate all your error reports and logging needs :eyes:`,
                    color: client.config.colors.base,
                    fields: [
                        {
                            name: 'Guilds',
                            value: `${client.guilds.cache.size} total guilds`,
                            inline: true
                        },
                        {
                            name: 'Users',
                            value: `${client.users.cache.size} total users`,
                            inline: true
                        },
                        {
                            name: 'Commands',
                            value: `${client.commands.all.size} total commands`,
                            inline: true
                        }
                    ]
                })
            ]
        })
    }
}