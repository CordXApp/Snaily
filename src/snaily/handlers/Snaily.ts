import type Snaily from "../client";
import mongo, { Model } from "mongoose";
import { SnailyReports } from "../../types/client/err.types";
import { Errors } from "../../models/ErrorSchema";
import { Logger } from "../utils/Logger";
import { TextChannel } from "discord.js";
import { v4 as uuidv4 } from "uuid";

export class SnailyClient {
    public client: Snaily;
    public logger: Logger;
    private reports: typeof Errors;
    public mongo: typeof mongo;
    public url: string;

    constructor(client: Snaily, url: string) {
        this.client = client;
        this.logger = new Logger("Snaily Manager");
        this.reports = Errors;
        this.mongo = mongo;
        this.url = url;
    }

    public async init(): Promise<void> {
        this.logger.info(`Connecting to the database chief...`);
        await this.mongo.connect(this.url).then(() => {
            this.logger.info(`Connected to the database chief: ${this.url.substring(0, 5)}.*********`);
        }).catch((err: any) => {
            this.logger.error(`Error connecting to the database: ${err.stack}`);
        })
    }

    public async getReport(id: string): Promise<{ success: boolean, message?: string, report?: SnailyReports }> {

        if (!id) return { success: false, message: "No ID provided." };

        if (id.length < 8) return { success: false, message: "Hold up chief, that ID is too short, please provide the first **8** characters of a valid Snaily Report ID" };
        if (id.length > 8) return { success: false, message: "Hold up chief, that ID is too long, please provide the first **8** characters of a valid Snaily Report ID" };

        const regex = new RegExp(`^${id}`);

        const report = await this.mongo.models.cordxErrors?.findOne({
            reportId: { $regex: regex }
        })

        if (!report) return { success: false, message: "No report found with that ID." };

        return { success: true, report };
    }

    public async getStatistics(): Promise<{ success: boolean, message?: string, data?: any }> {

        const reports = await this.mongo.models.cordxErrors?.find();

        if (!reports) return { success: false, message: "No reports found." };

        return {
            success: true,
            data: {
                open: reports.filter((r: any) => r.state === "OPEN").length,
                investigating: reports.filter((r: any) => r.state === "INVESTIGATING").length,
                resolved: reports.filter((r: any) => r.state === "RESOLVED").length,
                ignored: reports.filter((r: any) => r.state === "IGNORED").length,
                duplicate: reports.filter((r: any) => r.state === "DUPLICATE").length,
                not_a_bug: reports.filter((r: any) => r.state === "NOT_A_BUG").length,
                need_more_info: reports.filter((r: any) => r.state === "NEED_MORE_INFO").length,
                closed: reports.filter((r: any) => r.state === "CLOSED").length,
                total: reports.length
            }
        }
    }

    public async createReport(message: string, opts: {
        type: 'AUTH_FLOW' | 'API' | 'WEB' | 'INTERNAL' | 'DATABASE' | 'CACHE' | 'OTHER' | 'UNKNOWN',
        info: string,
        error: any,
        status: string,
        support: string,
        reporter?: string
    }): Promise<SnailyReports> {

        const error = new Error(message) as SnailyReports;

        error.type = opts.type;
        error.info = opts.info;
        error.status = opts.status;
        error.message = message;
        error.reporter = opts.reporter || "Snaily";
        error.reportId = await this.createReportId();
        error.support = opts.support;
        error.error = opts.error;

        await this.mongo.models.cordxErrors?.create({
            state: 'OPEN',
            info: error.info,
            type: error.type,
            status: error.status,
            message: error.message,
            reporter: error.reporter,
            reportId: error.reportId,
            error: error.error
        });

        const channel = await this.client.channels.cache.get(this.client.config.snaily.channel) as TextChannel;

        await channel.send({
            content: `<@&> <@&>\n\nA new error/diagnostics report has been generated.`,
            embeds: [
                new this.client.embeds({
                    title: 'Snaily: error report',
                    description: `- **Type:** ${error.type}\n- **Status:** ${error.status}\n- **Report ID:** ${error.reportId}\n- **Reporter:** ${error.reporter}\n- **View/Manage:** use \`/report\`.`,
                    color: this.client.config.colors.error
                })
            ]
        })

        throw error;
    }

    private async createReportId(): Promise<string> {
        const id = await uuidv4();

        const check = await this.mongo.models.cordxErrors?.findOne({ reportId: id });

        if (check) return this.createReportId();

        return id;
    }
}