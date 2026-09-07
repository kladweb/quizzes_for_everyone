import { createHash } from 'node:crypto';
import { getStore, connectLambda, Store } from '@netlify/blobs';
import type { HandlerEvent } from '@netlify/functions';
import { parseSchedule, type DaySchedule } from './parseSchedule';
import { formatSchedule } from './formatMessage';

const SOURCE_URL = 'http://ggpk.by/Raspisanie/Files/P_KURS.html';
const GROUP_NAME = process.env.SCHEDULE_GROUP || 'ПГБ-121';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface RunCheckResult {
  statusCode: number;
  body: string;
}

async function sendTelegramMessage(text: string): Promise<void> {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID env vars are not set');
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  // Telegram messages are capped at 4096 chars — split into chunks if needed.
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 3900));
    remaining = remaining.slice(3900);
  }

  for (const chunk of chunks) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: chunk,
        parse_mode: 'Markdown',
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Telegram API error ${res.status}: ${body}`);
    }
  }
}

function hashSchedule(schedule: DaySchedule[]): string {
  return createHash('sha256').update(JSON.stringify(schedule)).digest('hex');
}

/**
 * Gets the Blobs store. Prefers Netlify's automatic environment (works on
 * deployed sites, and in local dev in most cases once `netlify link` has
 * been run). Falls back to explicit siteID/token — set via NETLIFY_SITE_ID
 * and NETLIFY_AUTH_TOKEN env vars — for cases where local dev doesn't
 * inject the automatic context for schedule()-wrapped functions (a known
 * rough edge in some Netlify CLI versions). See README for how to get
 * these two values.
 */
export function getBlobStore(): Store {
  const manualSiteID = process.env.NETLIFY_SITE_ID;
  const manualToken = process.env.NETLIFY_AUTH_TOKEN;
  if (manualSiteID && manualToken) {
    return getStore({ name: 'schedule-monitor', siteID: manualSiteID, token: manualToken });
  }
  return getStore('schedule-monitor');
}

/**
 * Fetches the source page, compares it to the last saved snapshot,
 * and notifies Telegram if it changed. Shared by every scheduled
 * entry point so the cron files themselves stay tiny.
 */
export async function runCheck(event?: HandlerEvent): Promise<RunCheckResult> {
  // Functions written with the classic exports.handler = schedule(...) syntax
  // run in "Lambda compatibility mode", where Netlify Blobs isn't configured
  // automatically — connectLambda() wires it up from the incoming event.
  // See: MissingBlobsEnvironmentError. HandlerEvent doesn't declare the
  // `blobs` field connectLambda expects, but it's present at runtime in
  // that mode, hence the cast.
  if (event) {
    try {
      connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
    } catch (e) {
      console.warn('connectLambda skipped:', (e as Error).message);
    }
  }

  const store = getBlobStore();

  try {
    const res = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ScheduleWatcher/1.0; +personal use)',
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch source page: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    const schedule = parseSchedule(buf, GROUP_NAME);
    const currentHash = hashSchedule(schedule);

    const previousHash = await (store.get('last-hash') as unknown as Promise<string | null>);

    if (previousHash === null) {
      // First run ever — just save the baseline, no notification spam.
      await store.set('last-hash', currentHash);
      await store.setJSON('last-schedule', schedule);
      await store.set('last-checked', new Date().toISOString());
      return { statusCode: 200, body: 'Baseline saved, no previous state to compare.' };
    }

    await store.set('last-checked', new Date().toISOString());

    if (currentHash !== previousHash) {
      const message = formatSchedule(schedule, GROUP_NAME);
      await sendTelegramMessage(message);

      await store.set('last-hash', currentHash);
      await store.setJSON('last-schedule', schedule);
      await store.set('last-changed', new Date().toISOString());

      return { statusCode: 200, body: 'Change detected, Telegram notified.' };
    }

    return { statusCode: 200, body: 'No change.' };
  } catch (err) {
    console.error('runCheck failed:', err);
    try {
      await sendTelegramMessage(`⚠️ Ошибка в проверке расписания: ${(err as Error).message}`);
    } catch {
      /* ignore secondary failure */
    }
    return { statusCode: 500, body: String((err as Error).message || err) };
  }
}
