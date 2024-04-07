import type { ApplicationCommand, ApplicationCommandData, PermissionResolvable, Interaction } from "discord.js"
import type SnailyClient from "../../snaily/client";

export interface ISlashCommand {
    props: SlashCommandProps;
    execute: (client: SnailyClient, interaction: Interaction, args: any) => void;
    discord?: {
        ApplicationCommand: ApplicationCommand;
        ApplicationCommandData: ApplicationCommandData;
    }
}

export interface SlashCommandProps {
    name: string;
    description: string;
    example?: string;
    usage?: string;
    category: string;
    cooldown: number;
    staff?: boolean;
    client: PermissionResolvable;
    user: PermissionResolvable;
    options?: SlashCommandOptions[];
}

export interface SlashCommandOptions {
    name: string;
    description: string;
    example?: string;
    usage?: string;
    options?: any[];
    choices?: any[];
    required?: boolean;
    type: number;
}