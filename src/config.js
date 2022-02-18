import dotenv from 'dotenv';

dotenv.config();

function getCoinConfigs() {
  const coinKeys = Object.keys(process.env).filter(key => key.indexOf('_DISCORD_TOKEN') >= 0);
  return coinKeys.map((key) => {
    const config = process.env[key];
    const [discordToken, symbol, platformId] = config.split('|');
    return { discordToken, symbol, platformId };
  });
}

export { getCoinConfigs };
