import { StatsResponse, CreateResponse } from './res.types';

export interface Report {
    type: string;
    status: string;
    info: string;
    reporter: string;
    staffNote?: string;
    message: string;
    error: string;
}

export interface Responses {
    stats: StatsResponse;
    create: CreateResponse;
}