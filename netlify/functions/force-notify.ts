import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { parseSchedule } from '../../lib/parseSchedule';
import { formatSchedule } from '../../lib/formatMessage';
import { sendTelegramMessage } from '../../lib/runCheck';

const SOURCE_URL = 'http://ggpk.by/Raspisanie/Files/P_KURS.html';
const GROUP_NAME = process.env.SCHEDULE_GROUP || 'ПГБ-121';

// TEMPORARY test endpoint — delete this file once you've confirmed
// the Telegram delivery works. It deliberately does NOT touch the
// "last-hash" snapshot in Blobs, so it can't interfere with the real
// change-detection logic in check-schedule-main/tail.
//
// Protected by a simple shared-secret query param so a random visitor
// who finds the URL can't spam your Telegram: call it as
// /.netlify/functions/force-notify?key=<TEST_TRIGGER_SECRET>
export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const expectedKey = process.env.TEST_TRIGGER_SECRET;
  const providedKey = event.queryStringParameters?.key;

  if (!expectedKey) {
    return {
      statusCode: 500,
      body: 'TEST_TRIGGER_SECRET env var is not set — refusing to run an unprotected trigger.',
    };
  }
  if (providedKey !== expectedKey) {
    return { statusCode: 403, body: 'Forbidden: missing or incorrect ?key=' };
  }

  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ScheduleWatcher/1.0; +personal use)',
      },
    });
    if (!res.ok) {
      return { statusCode: 502, body: `Failed to fetch source page: ${res.status}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const allDays = parseSchedule(buf, GROUP_NAME);
    if (allDays.length === 0) {
      return { statusCode: 502, body: `Расписание для группы ${GROUP_NAME} не найдено на странице` };
    }
    // Same rule as in runCheck: only the last (newest) day on the page matters.
    const schedule = [allDays[allDays.length - 1]];
    const message = `🧪 ТЕСТОВОЕ сообщение (реального изменения не было)\n\n${formatSchedule(schedule, GROUP_NAME)}`;

    await sendTelegramMessage(message);

    return { statusCode: 200, body: 'Test message sent to Telegram.' };
  } catch (err) {
    return { statusCode: 500, body: String((err as Error).message || err) };
  }
};
