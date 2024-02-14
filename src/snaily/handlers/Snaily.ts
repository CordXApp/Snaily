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
        type: SnailyReports['type'],
        info: SnailyReports['info'],
        error: SnailyReports['error'],
        status: SnailyReports['status'],
        support?: SnailyReports['support'],
        reporter?: SnailyReports['reporter']
    }): Promise<{ success: boolean, message: string, report?: SnailyReports }> {

        if (!opts.type || typeof opts.type !== 'string') return { success: false, message: "Please provide a valid type for the report." };
        if (!opts.info || typeof opts.info !== 'string') return { success: false, message: "Please provide some valid info for the report." };
        if (!opts.error || typeof opts.error !== 'object') return { success: false, message: "Please provide a valid error object for the report." };
        if (!opts.status || typeof opts.status !== 'string') return { success: false, message: "Please provide a valid status for the report." };
        if (opts.support && typeof opts.support !== 'string') return { success: false, message: "Please provide a valid support link for the report." };
        if (opts.reporter && typeof opts.reporter !== 'string') return { success: false, message: "Please provide a valid reporter for the report." };

        if (!opts.support) opts.support = "https://cordximg.host/discord";
        if (!opts.reporter) opts.reporter = "Snaily";

        const error = new Error(message) as SnailyReports;

        error.type = opts.type;
        error.info = opts.info;
        error.status = opts.status;
        error.message = message;
        error.reporter = opts.reporter || "Snaily";
        error.reportId = await this.createReportId();
        error.support = opts.support ? opts.support : "N/A";
        error.error = opts.error;

        const report = await this.mongo.models.cordxErrors?.create({
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
            content: `A new error/diagnostics report has been generated.`,
            embeds: [
                new this.client.embeds({
                    title: 'Snaily: error report',
                    description: `- **Type:** ${error.type}\n- **Status:** ${error.status}\n- **Report ID:** ${error.reportId}\n- **Reporter:** ${error.reporter}\n- **View/Manage:** use \`/report\`.`,
                    color: this.client.config.colors.error
                })
            ]
        })

        return {
            success: true,
            message: `A new report has been created with ID: ${report.reportId}`,
            report: error
        };
    }

    public async updateReportState(reportId: string, state: SnailyReports['state']): Promise<{ success: boolean, message: string }> {

        const regex = new RegExp(`^${reportId}`);

        const report = await this.mongo.models.cordxErrors?.findOne({ reportId: { $regex: regex } });

        if (!report) return { success: false, message: "No report found with that ID." };

        if (report.state === state) return { success: false, message: "The report is already in that state." };

        if (state === "RESOLVED") {
            report.resolvedAt = new Date();
        }

        if (state === "IGNORED") {
            report.ignoredAt = new Date();
        }

        if (state === "CLOSED") {
            report.closedAt = new Date();
        }

        if (state === "INVESTIGATING") {
            report.investigatingAt = new Date();
        }

        report.state = state;

        await report.save().catch(async (err: any) => {
            await this.createReport(`Error updating report state.`, {
                type: 'INTERNAL',
                info: 'Error updating report state.',
                error: err,
                status: 'SNAILY_FAILURE:UPDATE_REPORT_STATE',
            }).then((data) => {
                return {
                    success: false,
                    message: `Whoops, something went wrong, but we've created a report for it. You can reference it with the ID: \`${data.report?.reportId}\``
                };
            });
        })

        return { success: true, message: "Report state updated." };
    }

    public async addReportNote(reportId: string, note: string): Promise<{ success: boolean, message: string }> {

        const regex = new RegExp(`^${reportId}`);

        const report = await this.mongo.models.cordxErrors?.findOne({ reportId: { $regex: regex } });

        if (!report) return { success: false, message: "No report found with that ID." };

        report.staffNote = note;

        await report.save().catch(async (err: any) => {
            await this.createReport(`Error adding report note.`, {
                type: 'INTERNAL',
                info: 'Error adding report note.',
                error: err,
                status: 'SNAILY_FAILURE:ADD_REPORT_NOTE',
            }).then((data) => {
                return {
                    success: false,
                    message: `Whoops, something went wrong, but we've created a report for it. You can reference it with the ID: \`${data.report?.reportId}\``
                };
            });
        })

        return { success: true, message: "Report note added." };
    }

    private async createReportId(): Promise<string> {
        const id = await uuidv4();

        const check = await this.mongo.models.cordxErrors?.findOne({ reportId: id });

        if (check) return this.createReportId();

        return id;
    }
}