import { Collection, ApplicationCommandOptionType } from "discord.js"
import type { CacheType, Interaction, BaseInteraction } from "discord.js"
import EventBase from "../../schemas/Listeners"
import type Snaily from "../../client"

export default class InteractionCreate extends EventBase {
    constructor() {
        super({ name: "interactionCreate" })
    }

    public async execute(
        client: Snaily,
        interaction: Interaction<CacheType>,
        int: BaseInteraction,
    ): Promise<any> {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)

            const cmd = command

            if (!cmd) return

            const user: any = await client.guilds.cache.get(client.config.client.guild as string)?.members.fetch(interaction.user.id);

            const support = user.roles.cache.some((role: any) => role.id === client.config.roles.support as string);
            const developers = user.roles.cache.some((role: any) => role.id === client.config.roles.developer as string);

            if (cmd.props.staff && !(support || developers)) return interaction.reply({
                ephemeral: true,
                embeds: [
                    new client.embeds({
                        title: 'Snaily: access denied',
                        description: `Hold up, you don't possess the powers needed to do that, this command is limited to our <@&${client.config.roles.support}> and <@&${client.config.roles.developer}>.`,
                        color: client.config.colors.error,
                        thumbnail: client.config.snaily.judge
                    })
                ]
            })

            if (cmd.props.staff && interaction.channelId !== client.config.snaily.channel as string) return interaction.reply({
                ephemeral: true,
                embeds: [
                    new client.embeds({
                        title: 'Snaily: access denied',
                        description: `Listen, we are glad you are looking into this, but you can only use this command in my designated channel: <#${client.config.snaily.channel}>.`,
                        color: client.config.colors.error,
                        thumbnail: client.config.snaily.judge
                    })
                ]
            })

            if (cmd.props.cooldown) {
                if (!client.cooldown.has(cmd.props.name)) {
                    client.cooldown.set(cmd.props.name, new Collection())
                }

                const now = Date.now()

                const timestamps = client.cooldown.get(cmd.props.name)
                const cooldownAmount = cmd.props.cooldown * 1000

                if (timestamps?.has(interaction.user.id)) {
                    const cooldown = timestamps.get(interaction.user.id)

                    if (cooldown) {
                        const expirationTime = cooldown + cooldownAmount

                        if (now < expirationTime) {
                            const timeLeft = (expirationTime - now) / 1000

                            return interaction.reply({
                                ephemeral: true,
                                embeds: [
                                    new client.embeds({
                                        title: 'Snaily: cooldown',
                                        description: `Whoa, slow down! You need to wait **${timeLeft.toFixed(1)}** more second(s) before reusing the \`${cmd.props.name}\` command.`,
                                        color: client.config.colors.error,
                                        thumbnail: client.config.snaily.judge
                                    })
                                ]
                            })
                        }
                    }
                }

                timestamps?.set(interaction.user.id, now)
                setTimeout(
                    () => timestamps?.delete(interaction.user.id),
                    cooldownAmount,
                )
            }

            const args: any = []

            for (let option of interaction.options.data) {
                if (option.type === ApplicationCommandOptionType.Subcommand) {
                    if (option.name) args.push(option.name)
                    option.options?.forEach((x: any) => {
                        if (x.value) args.push(x.value)
                    })
                } else if (option.value) args.push(option.value)
            }

            try {
                cmd.execute(client, interaction, args)
            } catch (err: any) {
                client.logs.error(
                    `Error while executing command ${cmd.props.name}: ${err.stack}`,
                )
                return interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                })
            }
        }
    }
}