import dotenv from 'dotenv';

dotenv.config();

const coinConfigs = [
  {
    discordToken: process.env.SLP_DISCORD_TOKEN,
    platformId: 'smooth-love-potion',
    symbol: 'SLP',
  },
  {
    discordToken: process.env.AXS_DISCORD_TOKEN,
    platformId: 'axie-infinity',
    symbol: 'AXS',
  },
  {
    discordToken: process.env.BTC_DISCORD_TOKEN,
    platformId: 'bitcoin',
    symbol: 'BTC',
  },
];

export { coinConfigs };
