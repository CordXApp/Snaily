import type { BitFieldResolvable, GatewayIntentsString } from "discord.js"

export interface ClientOptions {
    restVersion: number;
    intents: BitFieldResolvable<GatewayIntentsString, number>;
    partials: string[];
    allowedMentions: {
        parse: ("users" | "roles" | "everyone")[];
        repliedUser: boolean;
    };
}

export interface IConfig {
    client: {
        id: string;
        token: string;
        guild: string;
    }
    colors: {
        base: string;
        error: string;
        success: string;
        warning: string;
    }
    database: {
        url: string;
    }
    snaily: {
        errors: string;
        channel: string;
        logo: string;
        judge: string;
        terms: string;
    },
    roles: {
        support: string;
        developer: string;
    },
    server: {
        port: string;
        host: string;
    }
}

export const CommandTypes = {
    SubCommand: 1,
    SubCommandGroup: 2,
    String: 3,
    Integer: 4,
    Boolean: 5,
    User: 6,
    Channel: 7,
    Role: 8,
    Mentionable: 9,
    Number: 10,
    Attachment: 11,
}