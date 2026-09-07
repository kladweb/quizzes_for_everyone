import { schedule, type HandlerEvent } from '@netlify/functions';
import { runCheck } from './lib/runCheck';

// UTC 17:00 == Minsk time (UTC+3) 20:00 — the closing edge of the window.
// A plain "every 30 min from 7 to 17 UTC" cron would also fire at 17:30
// (20:30 Minsk), one step past the requested window, so that last check
// is split into its own single-time cron instead.
export const handler = schedule('0 17 * * *', (event: HandlerEvent) => runCheck(event));
