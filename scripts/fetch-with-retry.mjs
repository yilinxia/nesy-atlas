const RETRYABLE_STATUS = (status) => status === 429 || status >= 500 && status <= 599;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retryAfterMs(headers, nowMs = Date.now()) {
  const value = headers?.get?.('retry-after')?.trim();
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value) * 1000;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? Math.max(0, timestamp - nowMs) : null;
}

export async function fetchWithRetry(url, options = {}) {
  const {
    fetchImpl = fetch,
    fetchOptions = {},
    timeoutMs = 15000,
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    sleepImpl = sleep,
    randomImpl = Math.random,
    nowImpl = Date.now,
    label = new URL(url).hostname,
    onRetry = ({ attempt, delayMs, reason }) => {
      console.warn(
        `Retrying ${label} after ${reason} in ${Math.ceil(delayMs / 1000)}s `
        + `(attempt ${attempt + 1}/${maxAttempts})`
      );
    }
  } = options;

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new Error('maxAttempts must be a positive integer');
  }

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timer = timeoutMs > 0
      ? setTimeout(() => controller.abort(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs)
      : null;
    let response;

    try {
      response = await fetchImpl(url, { ...fetchOptions, signal: controller.signal });
    } catch (error) {
      lastError = error;
    } finally {
      if (timer) clearTimeout(timer);
    }

    if (response && (!RETRYABLE_STATUS(response.status) || attempt === maxAttempts)) {
      return response;
    }
    if (!response && attempt === maxAttempts) throw lastError;

    const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
    const serverDelay = response ? retryAfterMs(response.headers, nowImpl()) : null;
    const jitter = Math.floor(exponentialDelay * 0.2 * randomImpl());
    const delayMs = Math.min(maxDelayMs, serverDelay ?? exponentialDelay + jitter);
    const reason = response ? `HTTP ${response.status}` : lastError?.message || 'a network error';

    if (response?.body?.cancel) await response.body.cancel();
    onRetry({ attempt, delayMs, reason, response, error: lastError });
    await sleepImpl(delayMs);
  }

  throw lastError || new Error(`Failed to fetch ${label}`);
}
