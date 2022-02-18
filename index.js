import dotenv from 'dotenv';

dotenv.config();

import { getCoinConfigs } from './src/config.js';
import { fetchCoinsDataAndChangeNickName, loginToDiscord } from './src/discord.js';

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// RUNNING
const discordBots = await loginToDiscord(getCoinConfigs());

while (true) {
  const totalRunning = discordBots.map(({ discordBot }) => discordBot.isReady()).filter(e => !!e);
  if (totalRunning.length === discordBots.length) {
    console.log('Bots are running!');
    break;
  }
  await delay(1000);
}

await fetchCoinsDataAndChangeNickName(discordBots);
setInterval(async () => {
  await fetchCoinsDataAndChangeNickName(discordBots);
}, 60000);
