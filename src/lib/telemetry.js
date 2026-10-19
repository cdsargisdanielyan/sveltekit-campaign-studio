/** @param {{kind:'vital'|'error',name:string,value?:number,message?:string}} metric */
export function report(metric) {
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
