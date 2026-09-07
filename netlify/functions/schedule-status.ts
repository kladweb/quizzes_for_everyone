import { connectLambda } from '@netlify/blobs';
import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { getBlobStore } from './lib/runCheck';

// Simple GET endpoint: /.netlify/functions/schedule-status
// Shows when the checker last ran and when it last detected a change.
// Useful for confirming the scheduled function is alive without waiting.
export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  if (event) {
    try {
      connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
    } catch (e) {
      console.warn('connectLambda skipped:', (e as Error).message);
    }
  }

  const store = getBlobStore();

  const [lastChecked, lastChanged, lastSchedule] = await Promise.all([
    store.get('last-checked') as unknown as Promise<string | null>,
    store.get('last-changed') as unknown as Promise<string | null>,
    store.get('last-schedule', { type: 'json' }),
  ]);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ lastChecked, lastChanged, lastSchedule }, null, 2),
  };
};
