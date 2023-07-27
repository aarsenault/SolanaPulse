import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_RPC_URL } from '../config/constants';
import { Wallet } from '../data/highGrowthWallets';

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

interface WalletBallance {
  address: string;
  solBalance: number | null;
}

async function getSolBalance(walletAddress: string): Promise<number | null> {
  try {
    const publicKey = new PublicKey(walletAddress);

    // Fetch the account information
    const accountInfo = await connection.getAccountInfo(publicKey);

    // Check if the account exists and contains a balance
    if (accountInfo) {
      // Convert the lamports. 1 lamport has a value of 0.000000001 SOL.
      const solBalance = accountInfo.lamports / Math.pow(10, 9);

      return solBalance;
    } else {
      return null; // Address is invalid
    }
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    throw error;
  }
}

export async function getSolBalances(walletAddresses: Wallet[]): Promise<WalletBallance[] | null> {
  const response: WalletBallance[] = [];

  for (const wallet of walletAddresses) {
    const solBalance = await getSolBalance(wallet.address);
    response.push({ address: wallet.address, solBalance });
  }

  return response;
}
