import { Client, DiscordAPIError, Intents } from 'discord.js';
import { getCryptoPrices } from './crypto.js';

/**
 * @param {Array} coinConfigs
 * @returns {Promise<Object[]>}
 */
async function loginToDiscord(coinConfigs) {
  const INTENTS = [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ];
  const discordBots = await Promise.all(
    coinConfigs.map(async (coinConfig) => {
      const discordBot = new Client({ intents: INTENTS, partials: ['CHANNEL'] });
      await discordBot.login(coinConfig.discordToken);

      return { discordBot, ...coinConfig };
    }),
  );
  return discordBots;
}

/**
 * @param {Client} discordBot
 * @param {boolean} isPriceIncreasing
 * @param {Object} price
 * @param {string} symbol
 * @returns {Promise<void>}
 */
async function updateBotDisplay(discordBot, isPriceIncreasing, price, symbol) {
  let guild;
  try {
    guild = await discordBot.guilds.fetch(process.env.SERVER_ID);
  } catch (e) {
    if (e instanceof  DiscordAPIError && e.message === 'Missing Access') {
      console.log(`Missing access: ${discordBot.user.username}`);
      return;
    }
  }
  const nickname = `${symbol} ${isPriceIncreasing ? '⬈' : '⬊'} $${price.lastPrice.toString()}`;
  const activity = `24h: ${price.priceChangePercent.toFixed(2)}%`;
  const nicknameColor = isPriceIncreasing ? '#2ecc71' : '#ed4245';
  const shouldUpdateDisplay = (
    guild.me.nickname !== nickname ||
    (guild.me.roles.botRole && guild.me.roles.botRole.hexColor !== nicknameColor) ||
    discordBot.user.presence.activities.length === 0 ||
    discordBot.user.presence.activities[0].name !== activity
  );

  if (shouldUpdateDisplay) {
    discordBot.user.setPresence({
      activities: [{
        name: `24h: ${price.priceChangePercent.toFixed(2)}%`,
        type: 'WATCHING'
      }]
    });
    try {
      await Promise.all([
        guild.me.setNickname(nickname),
        guild.me.roles.botRole.setColor(nicknameColor),
      ]);
    } catch (e) {
      if (e instanceof  DiscordAPIError && e.message === 'Missing Permissions') {
        console.log(`Missing permissions: ${discordBot.user.username}`);
      }
    }
  }
}

/**
 * @param {Object[]} discordBots
 * @returns {Promise<void>}
 */
async function fetchCoinsDataAndChangeNickName(discordBots) {
  const coinIds = discordBots.map(e => e.platformId);
  const priceData = await getCryptoPrices(coinIds);

  // change here if changing platform
  await Promise.all(
    discordBots.map(async ({ discordBot, platformId, symbol }) => {
      const price = priceData[platformId];
      const isPriceIncreasing = price.lastPrice > price.openPrice;
      await updateBotDisplay(discordBot, isPriceIncreasing, price, symbol);
    }),
  );
}

export { loginToDiscord, fetchCoinsDataAndChangeNickName };
