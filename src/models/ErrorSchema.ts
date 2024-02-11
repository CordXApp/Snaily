import { Schema, model, models } from "mongoose";
import { SnailyReports } from "../types/client/err.types";

const ErrorSchema = new Schema<SnailyReports>({
    state: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    info: { type: String, required: true },
    message: { type: String, required: true },
    reporter: { type: String, required: true },
    reportId: { type: String, required: true },
    error: { type: Object, required: false },
    resolvedAt: { type: Date, required: false },
    ignoredAt: { type: Date, required: false }
}, {
    timestamps: true
})

const Errors = models.cordxErrors || model<SnailyReports>('cordxErrors', ErrorSchema);

export { Errors, ErrorSchema }