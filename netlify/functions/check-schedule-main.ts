import { schedule, type HandlerEvent } from '@netlify/functions';
import { runCheck } from './lib/runCheck';

// UTC 07:00–16:30, every 30 min == Minsk time (UTC+3) 10:00–19:30.
// Paired with check-schedule-tail.ts, which covers the 20:00 edge —
// see README for why this is split into two files instead of one cron.
export const handler = schedule('0,30 7-16 * * *', (event: HandlerEvent) => runCheck(event));
