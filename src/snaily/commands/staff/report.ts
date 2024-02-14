import type { CacheType, ChatInputCommandInteraction } from "discord.js"
import { CommandTypes } from "../../../types/client/client.types";
import { SnailyReports } from "src/types/client/err.types";
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
                    name: "help",
                    description: "Get help with the report command.",
                    type: CommandTypes.SubCommand,
                    options: [
                        {
                            name: 'subcommand',
                            description: 'The subcommand you need help with.',
                            type: CommandTypes.String,
                            required: false,
                        }
                    ]
                },
                {
                    name: "view",
                    description: "View a report.",
                    type: CommandTypes.SubCommand,
                    usage: "/report view <id>",
                    example: "/report view 1d3yft78",
                    options: [
                        {
                            name: "id",
                            description: "First 8 characters of the report id.",
                            type: CommandTypes.String,
                            required: true,
                        }
                    ]
                },
                {
                    name: "update",
                    description: "Update a report.",
                    type: CommandTypes.SubCommand,
                    usage: "/report update <id> <state>",
                    example: "/report update 1d3yft78 closed",
                    options: [
                        {
                            name: "id",
                            description: "First 8 characters of the report id.",
                            type: CommandTypes.String,
                            required: true,
                        },
                        {
                            name: "state",
                            description: "The new state of the report.",
                            type: CommandTypes.String,
                            required: true,
                            choices: [
                                {
                                    name: "Open",
                                    value: "OPEN"
                                },
                                {
                                    name: "Investigating",
                                    value: "INVESTIGATING"
                                },
                                {
                                    name: "Resolved",
                                    value: "RESOLVED"
                                },
                                {
                                    name: "Ignored",
                                    value: "IGNORED"
                                },
                                {
                                    name: "Duplicate",
                                    value: "DUPLICATE"
                                },
                                {
                                    name: "Not a bug",
                                    value: "NOT_A_BUG"
                                },
                                {
                                    name: "Need more info",
                                    value: "NEED_MORE_INFO"
                                },
                                {
                                    name: "Closed",
                                    value: "CLOSED"
                                }
                            ]
                        },
                        {
                            name: "note",
                            description: "Add a note to the report.",
                            type: CommandTypes.String,
                            required: false
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

            case "help": {

                const subcommand = interaction.options.getString("subcommand") as string;

                const subcommands = await this?.props?.options?.map((option) => {
                    return `\`${option.name} - ${option.description}\``
                });

                if (subcommand) {
                    const sub = this?.props?.options?.find((option) => option.name === subcommand);

                    if (!sub) return interaction.reply({
                        embeds: [
                            new client.embeds({
                                title: 'Error: subcommand not found!',
                                description: `Unable to locate a subcommand named: \`${subcommand}\``,
                                color: client.config.colors.error
                            })
                        ]
                    })

                    const subOptions = await sub?.options?.map((option) => {
                        return `\`${option.name} - ${option.description}\``;
                    })

                    return interaction.reply({
                        embeds: [
                            new client.embeds({
                                title: `Subcommand: ${sub.name}`,
                                description: `**Description:** ${sub.description}`,
                                color: client.config.colors.base,
                                fields: [
                                    {
                                        name: 'Params',
                                        value: `\`${subOptions}\``,
                                        inline: false
                                    },
                                    {
                                        name: 'Usage',
                                        value: `\`${sub.usage}\``,
                                        inline: false
                                    },
                                    {
                                        name: 'Example',
                                        value: `\`${sub.example}\``,
                                        inline: false
                                    }
                                ]
                            })
                        ]
                    })
                }

                return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Report Command Help',
                            description: `**Description:** ${this.props.description}`,
                            color: client.config.colors.base,
                            fields: [
                                {
                                    name: 'Usage',
                                    value: `\`${this.props.usage}\``,
                                    inline: true
                                },
                                {
                                    name: 'Example',
                                    value: `\`${this.props.example}\``,
                                    inline: true
                                },
                                {
                                    name: "Cooldown",
                                    value: `\`${this.props.cooldown} seconds\``,
                                    inline: true
                                },
                                {
                                    name: 'Subcommands',
                                    value: `\`${subcommands}\``,
                                    inline: false
                                }
                            ]
                        })
                    ]
                })
            }

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

                const stack = snaily.report?.error.stack ? snaily.report?.error.stack : snaily.report?.error.trace;

                return interaction.reply({
                    ephemeral: false,
                    embeds: [
                        new client.embeds({
                            title: `Snaily: ${snaily.report?.reportId}`,
                            description: `\`\`\`json\n${JSON.stringify(stack, null, 2)}\`\`\``,
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

            case "update": {
                const id = interaction.options.getString("id") as string;
                const state = interaction.options.getString("state") as string;
                const addNote = interaction.options.getString("note") as string;

                const snaily = await client.manager.getReport(id.slice(0, 8));

                const oldState = snaily.report?.state;

                if (!snaily.success) return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Error: report not found!',
                            description: `${snaily.message ? snaily.message : `Unable to locate a report id that starts with: \`${id.slice(0, 8)}\``}`,
                            color: client.config.colors.error
                        })
                    ]
                })

                if (oldState === state) return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Error: state unchanged!',
                            description: `The state of the report is already \`${state}\``,
                            color: client.config.colors.error
                        })
                    ]
                })

                if (addNote) await client.manager.addReportNote(id.slice(0, 8), addNote);

                if (addNote && addNote.length < 100) return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Error: note too short!',
                            description: `The note must be at least 100 characters long.`,
                            color: client.config.colors.error
                        })
                    ]
                })

                if (addNote && addNote.length > 2000) return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Error: note too long!',
                            description: `The note must be at most 2000 characters long.`,
                            color: client.config.colors.error
                        })
                    ]
                })

                await client.manager.updateReportState(id.slice(0, 8), state as SnailyReports["state"]);

                return interaction.reply({
                    embeds: [
                        new client.embeds({
                            title: 'Report Updated!',
                            description: `Report: \`${id.slice(0, 8)}\` has been updated.`,
                            color: client.config.colors.success,
                            fields: [
                                {
                                    name: 'Old State',
                                    value: `\`${oldState}\``,
                                    inline: true
                                },
                                {
                                    name: 'New State',
                                    value: `\`${state}\``,
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