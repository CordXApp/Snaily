import { SnailyReports } from "src/types/client/err.types";

export interface Body {
    type: SnailyReports['type'];
    status: SnailyReports['status'];
    info: SnailyReports['info'];
    reporter: SnailyReports['reporter'];
    reportId: SnailyReports['reportId'];
    staffNote: SnailyReports['staffNote'];
    support: SnailyReports['support'];
    error: SnailyReports['error'];
    message: String;
}

export type RequiredStates = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED' | 'DUPLICATE' | 'NOT_A_BUG' | 'NEED_MORE_INFO' | 'CLOSED'

export const ValidStates: RequiredStates[] = [
    'OPEN',
    'INVESTIGATING',
    'RESOLVED',
    'IGNORED',
    'DUPLICATE',
    'NOT_A_BUG',
    'NEED_MORE_INFO',
    'CLOSED'
]

export const ValidTypes = [
    'API',
    'AUTH',
    'CACHING',
    'DATABASE',
    'INTERNAL',
    'OTHER',
    'UNKNOWN',
    'WEBSITE'
]