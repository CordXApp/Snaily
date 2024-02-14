export interface SnailyReports extends Error {
    state: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'IGNORED' | 'DUPLICATE' | 'NOT_A_BUG' | 'NEED_MORE_INFO' | 'CLOSED'
    type: 'AUTH_FLOW' | 'API' | 'WEB' | 'INTERNAL' | 'DATABASE' | 'CACHE' | 'OTHER' | 'UNKNOWN'
    status: string
    info: string
    reporter: string
    reportId: string
    support: string
    error: any
    createdAt: Date
    updatedAt: Date
    resolvedAt: Date
    ignoredAt: Date
    investigatingAt: Date
    closedAt: Date
    staffNote: string
}