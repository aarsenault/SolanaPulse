interface TokenData {
  tokenMintAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}

const bullishTokenMap: TokenData[] = [
  // Add your most bullish SPL tokens here
  { tokenMintAddress: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6', name: 'KIN', symbol: 'KIN', decimals: 5 },
  { tokenMintAddress: '9noXzpXnkyEcKF3AeXqUHTdR59V5uvrRBUZ9bwfQwxeq', name: 'KING', symbol: 'KING', decimals: 9 },
  {
    tokenMintAddress: 'HxhWkVpk5NS4Ltg5nij2G671CKXFRKPK8vy271Ub4uEK',
    name: 'HXRO (Wormhole)',
    symbol: 'HXRO',
    decimals: 8,
  },
  {
    tokenMintAddress: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
    name: 'UXP Governance Token',
    symbol: 'UXP',
    decimals: 9,
  },
  {
    tokenMintAddress: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
    name: 'Wrapped Chainlink',
    symbol: 'SOLLET',
    decimals: 6,
  },
];

export default bullishTokenMap;
