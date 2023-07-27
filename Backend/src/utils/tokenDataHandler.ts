import axios from '../config/axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { delay } from './codeUtils';
import { getCachedData } from './cacheUtils';
import { FetchError } from 'node-fetch';
import { COINGECKO_SPL_ENDPOINT, PRICE_API_URL, SOLANA_RPC_URL } from '../config/constants';

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

interface SolanaRpcData {
  value: {
    amount: string;
    decimals: number;
  };
}

interface NodeFetchError extends FetchError {
  message: string;
}

interface TokenPriceData {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: 'USDC';
  price: number;
  name: string;
  symbol: string;
}

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

interface TokenMarketData {
  address: string;
  currentSupply: number | null;
  tokenPrice: number | null;
  marketCap: number | null;
  name: string;
  symbol: string;
}

// TODO - js doc all functions

export async function fetchTokenSupply(address: string): Promise<number | null> {
  let currentSupply: number | null = null;

  try {
    // Cache for 10 mins, ratelimit to 1 call per 30ms
    const solanaData: SolanaRpcData = await getCachedData(
      `rawSupply${address}`,
      () => connection.getTokenSupply(new PublicKey(address)),
      600000,
    );

    currentSupply = Number(solanaData.value.amount) / Math.pow(10, solanaData.value.decimals);
  } catch (error) {
    // need to explicitly check here in typescript 4.0+ due to error being default type "unknown"
    if (error instanceof Error) {
      const nodeFetchError = error as NodeFetchError;
      console.error(`Error fetching market data for token ${address}: ${nodeFetchError.message}`);
    }
  }
  return currentSupply;
}

export async function calculateMarketCaps(tokenPriceDataList: TokenPriceData[]): Promise<TokenMarketData[]> {
  const result: TokenMarketData[] = [];
  const marketCapPromises: Promise<void>[] = [];

  for (const tokenData of tokenPriceDataList) {
    const { id, price, name, symbol } = tokenData;
    let currentSupply: number | null = null;
    let tokenPrice: number | null = null;
    let marketCap: number | null = null;

    const marketCapData = (async () => {
      currentSupply = await fetchTokenSupply(id);

      tokenPrice = price || null;

      if (currentSupply && tokenPrice) {
        marketCap = currentSupply * tokenPrice;
      }

      result.push({
        address: id,
        currentSupply,
        tokenPrice,
        marketCap,
        name,
        symbol,
      });
    })();

    marketCapPromises.push(marketCapData);

    // TODO - formalize this quick rate limit attempt
    await delay(30);
  }

  // Wait for all marketCapPromises to complete
  await Promise.all(marketCapPromises);

  return result;
}

export async function fetchSPLTokenList(): Promise<any> {
  try {
    // Ideally stored in a DB - more resilient if coingecko has outages
    // Ultimately we would probably want to maintain our own list of tokens to track.
    // For now, cache 24 hrs. Depends when new tokens are created.
    const response = await getCachedData(`SPLTokenList`, () => axios.get<any>(COINGECKO_SPL_ENDPOINT), 86400000);

    return response;
  } catch (error) {
    console.error('Error fetching top SPL token list:', error);
    throw error;
  }
}

export async function getTopMarketCapTokens(numTokens?: number): Promise<TokenMarketData[]> {
  try {
    const splTokenList = await fetchSPLTokenList();
    // Extract the token data from the response
    const listOfTokens = Object.values(splTokenList.data)[4] as TokenData[];

    const tokensPriceList = await getCachedData(`TokenPriceData`, () => fetchTokensPricesData(listOfTokens), 90000);

    const marketData = await getCachedData(`MarketCaps`, () => calculateMarketCaps(tokensPriceList), 90000);

    // TODO - cache this sorted data as well.
    const sortedMarketData = sortByMarketCapDescending(marketData);

    if (numTokens) {
      return sortedMarketData.slice(0, numTokens);
    }

    return sortedMarketData;
  } catch (error) {
    console.error('Error fetching data for getTopMarketCapTokens:', error);
    throw error;
  }
}

async function fetchTokensPricesData(tokens: TokenData[]): Promise<TokenData[]> {
  // TODO: make these consts either params, or constants in a consts file
  const batchSize = 100;
  const delayBetweenRequestsMs = 5; //

  const responseData: any[] = [];

  const ids = tokens.map((token) => token.address);

  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);

    try {
      const response = await axios.get(PRICE_API_URL, {
        params: {
          ids: batchIds.join(','),
        },
      });

      responseData.push(...Object.values(response.data.data));

      // Add a delay between requests
      await delay(delayBetweenRequestsMs);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  }

  const mergedData = tokens.map((token) => {
    const responseItem = responseData.find((item) => item.id === token.address);

    return {
      ...token,
      ...responseItem,
    };
  });

  return mergedData;
}

function sortByMarketCapDescending(data: TokenMarketData[]): TokenMarketData[] {
  // Sort the array in descending order based on marketCap
  data.sort((a, b) => {
    // If either marketCap is null, move it to the end of the list
    if (a.marketCap === null) return 1;
    if (b.marketCap === null) return -1;

    // Sort in descending order based on marketCap
    return b.marketCap - a.marketCap;
  });

  return data;
}
