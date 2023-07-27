import { Connection, PublicKey, AccountInfo, PerfSample } from '@solana/web3.js';
import { getCachedData } from './cacheUtils';
import { delay } from './codeUtils';

const solanaRpcUrl = 'https://solana-mainnet.rpc.extrnode.com/';
const connection = new Connection(solanaRpcUrl, 'confirmed');

let startTime: number | null = null;
let startSlot: number | null = null;
let endSlot: number | null = null;
let endTime: number | null = null;

// Function to calculate 'true' TPS (user generated transactions)
export async function calculateTrueTps(): Promise<number | null> {
  try {
    if (startTime && startSlot && endTime && endSlot) {
      const elapsedSeconds = (endTime - startTime) / 1000;

      // TODO - not currently counting the number of transactions existing in block
      // Make this more accurate
      const numTransactions = await getCachedData(
        `transactionsWithinBlocks${startSlot}${endSlot}`,
        () => countTransactionsWithinBlocks(startSlot, endSlot),
        0,
      );

      let trueTps: number = 0;
      if (numTransactions) {
        trueTps = numTransactions / elapsedSeconds;
      }

      console.log({ startTime, endTime, elapsedSeconds, startSlot, endSlot });

      return trueTps;
    } else {
      // No previous block time, return 0 as there is no data to calculate trueTPS
      return null;
    }
  } catch (error) {
    console.error('Error calculating trueTPS:', error);
    throw error;
  }
}

async function countTransactionsWithinBlocks(startSlot: number | null, endSlot: number | null) {
  if (!startSlot || !endSlot) {
    return null;
  }

  try {
    const confirmedBlocks = await connection.getBlocks(startSlot, endSlot, 'finalized');

    let totalTransactions: number = 0;
    let numTransactions: number = 0;

    for (const block of confirmedBlocks) {
      numTransactions = await getNumTransactionsInBlock(block);
      totalTransactions += numTransactions;
    }

    return totalTransactions;
  } catch (error) {
    console.error('Error counting transactions:', error);
  }
}

async function getNumTransactionsInBlock(blockNumber: number) {
  let transactions: number = 0;

  try {
    const confirmedBlock = await getCachedData(
      `blockNumber${blockNumber}`,
      () =>
        connection.getBlock(blockNumber, {
          commitment: 'confirmed',
          transactionDetails: 'full',
          maxSupportedTransactionVersion: 0,
        }),
      0,
    ); // 0 cahceDuration means store blocks indefinitely as they are immutable

    if (confirmedBlock && confirmedBlock.transactions) {
      transactions = confirmedBlock.transactions.length;
    }
  } catch (error) {
    console.error('Error fetching block data:', error);
  }

  return transactions;
}

// Function to update the previous block time
export async function updateBlockTimes(): Promise<void> {
  const startSlotTmp = await connection.getSlot('finalized');
  const startTimeTmp = Date.now();

  // TODO - make this variable or move to constants file
  // 5 second sampling time for true tps
  await delay(5000);

  const endSlotTmp = await connection.getSlot('finalized');
  const endTimeTmp = Date.now();

  // Assign all variables at once after waiting
  startSlot = startSlotTmp;
  startTime = startTimeTmp;
  endSlot = endSlotTmp;
  endTime = endTimeTmp;
}

export async function calculateTpsUsingPerformanceSamples(): Promise<number> {
  try {
    const samples: PerfSample[] = await getCachedData('performanceSamples', () =>
      connection.getRecentPerformanceSamples(),
    );

    // Filter out any empty or incomplete samples
    const validSamples: PerfSample[] = samples.filter(
      (sample) => sample.numTransactions > 0 && sample.samplePeriodSecs > 0,
    );

    if (validSamples.length === 0) {
      throw new Error('No valid performance samples available.');
    }

    // Calculate the total number of transactions processed by the network
    const totalTransactions = validSamples.reduce((sum, sample) => sum + sample.numTransactions, 0);

    // Calculate the time duration covered by the samples (in seconds)
    const totalDurationSeconds = validSamples.reduce((sum, sample) => sum + sample.samplePeriodSecs, 0);

    // Calculate the TPS (transactions per second)
    const tps = totalTransactions / totalDurationSeconds;

    return tps;
  } catch (error) {
    console.error('Error calculating TPS:', error);
    throw error;
  }
}
