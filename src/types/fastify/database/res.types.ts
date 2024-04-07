import { errors } from '@prisma/client';

export interface StatsResponse {
    state: boolean;
    message?: string;
    data?: {
        open: number;
        closed: number;
        investigating: number;
        need_more_info?: number;
        not_a_bug?: number;
        duplicate: number;
        ignored: number;
        resolved: number;
        total: number;
    }
}

export interface CreateResponse {
    state: boolean;
    message?: string;
    data?: errors;
}