import dotenv from 'dotenv';

dotenv.config();

const coinConfigs = [
  {
    discordToken: process.env.CELO_DISCORD_TOKEN,
    platformId: 'celo',
    symbol: 'CELO',
  },
  {
    discordToken: process.env.BITCOIN_DISCORD_TOKEN,
    platformId: 'bitcoin',
    symbol: 'BTC',
  },
];

export { coinConfigs };
