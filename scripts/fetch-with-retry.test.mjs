import assert from 'node:assert/strict';
import test from 'node:test';

import { fetchWithRetry, retryAfterMs } from './fetch-with-retry.mjs';

test('parses Retry-After seconds and HTTP dates', () => {
  assert.equal(retryAfterMs(new Headers({ 'Retry-After': '12' }), 0), 12000);
  assert.equal(
    retryAfterMs(new Headers({ 'Retry-After': 'Tue, 11 Aug 2026 12:01:00 GMT' }), Date.parse('2026-08-11T12:00:00Z')),
    60000
  );
  assert.equal(retryAfterMs(new Headers(), 0), null);
});

test('retries rate limits and server failures while honoring Retry-After', async () => {
  const responses = [
    new Response('rate limited', { status: 429, headers: { 'Retry-After': '2' } }),
    new Response('unavailable', { status: 503 }),
    new Response('ok', { status: 200 })
  ];
  const delays = [];
  const retries = [];

  const response = await fetchWithRetry('https://example.com/data', {
    fetchImpl: async () => responses.shift(),
    maxAttempts: 3,
    baseDelayMs: 100,
    maxDelayMs: 5000,
    sleepImpl: async (delayMs) => { delays.push(delayMs); },
    randomImpl: () => 0,
    onRetry: (retry) => { retries.push(retry.reason); }
  });

  assert.equal(await response.text(), 'ok');
  assert.deepEqual(delays, [2000, 200]);
  assert.deepEqual(retries, ['HTTP 429', 'HTTP 503']);
});

test('retries network errors but not permanent client errors', async () => {
  let networkAttempts = 0;
  const recovered = await fetchWithRetry('https://example.com/data', {
    fetchImpl: async () => {
      networkAttempts += 1;
      if (networkAttempts === 1) throw new Error('socket reset');
      return new Response('ok');
    },
    sleepImpl: async () => {},
    randomImpl: () => 0,
    onRetry: () => {}
  });
  assert.equal(recovered.status, 200);
  assert.equal(networkAttempts, 2);

  let clientAttempts = 0;
  const rejected = await fetchWithRetry('https://example.com/data', {
    fetchImpl: async () => {
      clientAttempts += 1;
      return new Response('bad request', { status: 400 });
    },
    sleepImpl: async () => {},
    onRetry: () => {}
  });
  assert.equal(rejected.status, 400);
  assert.equal(clientAttempts, 1);
});
