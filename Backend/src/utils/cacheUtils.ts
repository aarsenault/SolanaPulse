import { cache } from '..';
import { delay } from './codeUtils';
import { fetchSPLTokenList, getTopMarketCapTokens } from './tokenDataHandler';

interface CacheData {
  data: any;
  expirationTime: number; // Timestamp when the cached data should expire, 0 means indefinite
}

export interface Cache {
  [key: string]: CacheData;
}

export async function initializeCache() {
  try {
    await fetchSPLTokenList();
    // await getTopMarketCapTokens();
    console.log('Cache initialization complete');
  } catch (error) {
    console.error('error initializing cache', error);
    throw error;
  }
}

export async function getCachedData(
  key: string,
  fetchData: () => Promise<any>,
  cacheDurationMs: number = 5000, // No value or 0 means store indefinitely
  rateLimitMs?: number,
): Promise<any> {
  // Check if the data is available in the cache and not expired
  if (cache[key] && (!cacheDurationMs || cache[key].expirationTime > Date.now())) {
    console.log('retrieving cached data', key);
    return cache[key].data;
  }

  // If the data is not available in the cache or expired, fetch it
  const data = await fetchData();

  // Cache the fetched data
  console.log('Cache miss, writing data', key);

  cache[key] = {
    data,
    expirationTime: cacheDurationMs ? Date.now() + cacheDurationMs : 0,
  };

  if (rateLimitMs) {
    await delay(rateLimitMs);
  }
  return data;
}
