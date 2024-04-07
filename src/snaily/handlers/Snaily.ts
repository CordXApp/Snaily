import type Snaily from "../client";
import { PrismaClient } from "@prisma/client";
import { StatsResponse } from "../../types/fastify/database/res.types";
import { Logger } from "../utils/Logger";

export class SnailyClient {
    public client: Snaily;
    public logger: Logger;
    public prisma: PrismaClient;

    constructor(client: Snaily) {
        this.client = client;
        this.logger = new Logger("Snaily Manager");
        this.prisma = new PrismaClient();
    }

    /**
     * Get report statistics
     * @returns {Promise<{ state: boolean, message?: string, data?: Object }>}
     * @memberof SnailyClient
     * @method getStatistics
     */
    public async getStatistics(): Promise<StatsResponse> {
        const reports = await this.prisma.errors.findMany();

        if (!reports) return {
            state: false,
            message: 'There aren\'t any reports in the database at this time.',
        }

        return {
            state: true,
            data: {
                open: reports.filter((r: any) => r.state === 'OPEN').length,
                closed: reports.filter((r: any) => r.state === 'CLOSED').length,
                investigating: reports.filter((r: any) => r.state === 'INVESTIGATING').length,
                need_more_info: reports.filter((r: any) => r.state === 'NEED_MORE_INFO').length,
                not_a_bug: reports.filter((r: any) => r.state === 'NOT_A_BUG').length,
                duplicate: reports.filter((r: any) => r.state === 'DUPLICATE').length,
                ignored: reports.filter((r: any) => r.state === 'IGNORED').length,
                resolved: reports.filter((r: any) => r.state === 'RESOLVED').length,
                total: reports.length,
            }
        }
    }

    public async createReport(data: any): Promise<{ state: boolean, message?: string, data?: Object }> {
        try {
            await this.prisma.errors.create({
                data: {
                    info: data.info,
                    type: data.type,
                    state: 'OPEN' as string,
                    status: data.status,
                    message: data.message,
                    reporter: data.reporter ? data.reporter : 'Snaily',
                    error: data.error ? data.error : 'No error info provided.',

                }
            })

            return {
                state: true,
                message: 'Report has been created successfully.'
            }
        } catch (err: any) {
            return {
                state: false,
                message: err.message
            }
        }
    }

    public async getRepoInfo(): Promise<any> {
        return {
            state: true,
            data: {
                url: 'https://github.com/CordXApp/Snaily'
            }
        }
    }
}