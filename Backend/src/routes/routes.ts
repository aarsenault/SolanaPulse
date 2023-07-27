import express from 'express';
import { fetchSPLTokenList, getTopMarketCapTokens } from '../utils/tokenDataHandler';
import { calculateTrueTps, calculateTpsUsingPerformanceSamples, updateBlockTimes } from '../utils/tpsCalculator';
import { Request, Response } from 'express';
import { getCachedData } from '../utils/cacheUtils';
import { getSolBalances } from '../utils/walletHandler';
import walletMap from '../data/highGrowthWallets';

const router = express.Router();

// TODO - abstract the fetching logic into controllers to clean up this routes file.
// i.e.:
// router.get('/tps', getTps);
// router.get('/fetch-spl-data', getSPLData);

// fetch block data for trueTPS calculation every 10 sec.
setInterval(updateBlockTimes, 10000);

let lastOutageTimestamp: number | null = Date.now();

// API health check at the default route
router.get('/', (req, res) => {
  const currentTimestamp = Date.now();

  if (lastOutageTimestamp) {
    const outageDuration = currentTimestamp - lastOutageTimestamp;
    const secondsSinceOutage = Math.floor(outageDuration / 1000);

    res.json({
      status: 'API is up and running!',
      currentRuntimeInSeconds: secondsSinceOutage,
    });
  } else {
    res.json({
      status: 'API is up and running!',
      currentRuntimeInSeconds: null,
    });
  }
});

router.get('/topMarketCapTokens/:numTokens', async (req: Request, res: Response) => {
  try {
    const numTokens = parseInt(req.params.numTokens);

    const topTokens = await getCachedData(
      `TopMarketCapTokens${numTokens}`,
      () => getTopMarketCapTokens(numTokens),
      90000,
    );
    res.json(topTokens);
  } catch (error) {
    console.error('Error fetching top market cap tokens:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/topMarketCapTokens', async (req: Request, res: Response) => {
  try {
    const topTokens = await getCachedData(`TopMarketCapTokens`, () => getTopMarketCapTokens(), 90000);
    res.json(topTokens);
  } catch (error) {
    console.error('Error fetching list of all market cap tokens:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get the TPS data
router.get('/tps', async (req, res) => {
  try {
    const trueTps = await calculateTrueTps();
    const tps = await calculateTpsUsingPerformanceSamples();
    res.json({ tps, trueTps });
  } catch (error) {
    console.error('Error fetching TPS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to surface the sol ballance for 10 wallets
router.get('/solBallanceTop10', async (req, res) => {
  try {
    const solBallanceTop10 = await getSolBalances(walletMap);
    res.json(solBallanceTop10);
  } catch (error) {
    console.error('Error fetching solBallanceTop10:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
