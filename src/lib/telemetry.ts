import type { Metric } from './contracts.ts';
export function report(metric: Omit<Metric, 'path'>) {
  if (typeof navigator === 'undefined') return;
  // No query strings, account information, stack traces, or campaign content.
  const body = JSON.stringify({
    ...metric,
    message: metric.message?.slice(0, 300),
    path: location.pathname,
  });
  navigator.sendBeacon(
    '/api/beacon',
    new Blob([body], { type: 'application/json' }),
  );
}
