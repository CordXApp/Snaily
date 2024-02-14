import { home } from './base/base.service';
import { stats } from './base/stats.service';
import { CreateReport } from './reports/create.service';

export const BaseServices = { home, stats };
export const ReportServices = { CreateReport }
