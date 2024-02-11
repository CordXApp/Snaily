import "dotenv/config"
import { Partials } from "discord.js"
import Snaily from "./snaily/client"
import { config } from "./cfg"

const client: Snaily = new Snaily({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildBans",
        "GuildMessages",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "DirectMessages",
        "DirectMessageReactions",
        "DirectMessageTyping",
        "MessageContent",
        "GuildModeration"
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.GuildMember,
        Partials.Channel,
    ],
    allowedMentions: { parse: ["users", "roles"], repliedUser: true },
})

client.authenticate(config.client.token as string)