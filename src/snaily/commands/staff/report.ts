import type { CacheType, ChatInputCommandInteraction } from "discord.js"
import { CommandTypes } from "../../../types/client/client.types";
import { SlashBase } from "../../schemas/Commands";
import type Snaily from "../../client"

export default class About extends SlashBase {
    constructor() {
        super({
            name: "report",
            description: "View and manage Snaily's reports.",
            usage: "/report view <id>",
            example: "/report view <id>",
            category: "Info",
            cooldown: 5,
            staff: true,
            user: [],
            client: [],
            options: [
                {
                    name: "view",
                    description: "View a report.",
                    type: CommandTypes.SubCommand,
                    options: [
                        {
                            name: "id",
                            description: "First 8 characters of the report id.",
                            type: CommandTypes.String,
                            required: true,
                        }
                    ]
                }
            ]
        })
    }

    public async execute(
        client: Snaily,
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<any> {

        switch (interaction.options.getSubcommand()) {

            case "view": {

                const id = interaction.options.getString("id") as string;

                const snaily = await client.manager.getReport(id.slice(0, 8));

                if (!snaily.success) return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Error: report not found!',
                            description: `${snaily.message ? snaily.message : `Unable to locate a report id that starts with: \`${id.slice(0, 8)}\``}`,
                            color: client.config.colors.error
                        })
                    ]
                })

                return interaction.reply({
                    ephemeral: false,
                    embeds: [
                        new client.embeds({
                            title: `Snaily: ${snaily.report?.reportId}`,
                            description: `\`\`\`json\n${JSON.stringify(snaily.report?.error.stack, null, 2)}\`\`\``,
                            color: client.config.colors.base,
                            fields: [
                                {
                                    name: '📅 Created at',
                                    value: `\`${new Date(snaily.report?.createdAt!).toLocaleString()}\``,
                                    inline: true
                                },
                                {
                                    name: '🔍 Report Status',
                                    value: `\`${snaily.report?.status}\``,
                                    inline: true
                                },
                                {
                                    name: '📄 Report Info',
                                    value: `\`${snaily.report?.error.message}\``,
                                    inline: true
                                },
                                {
                                    name: '👨‍💻 Reported By',
                                    value: `<@${snaily.report?.reporter}>`,
                                    inline: true
                                },
                                {
                                    name: '📌 Report Location',
                                    value: `Root: \`${snaily.report?.type}\``,
                                    inline: true
                                },
                                {
                                    name: '📝 Report State',
                                    value: `Currently: \`${snaily.report?.state}\``,
                                    inline: true
                                }
                            ]
                        })
                    ]
                })
            }
        }
    }
}