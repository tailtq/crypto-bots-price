import axios from 'axios';

const PLATFORM_NAME = 'binance';
const PLATFORM_SERVER = 'https://api.binance.com/api';
const coinPlatformAxios = axios.create({
  baseURL: PLATFORM_SERVER,
  timeout: 30000,
});

/**
 * @param {Array} coinIds
 * @returns {Promise<Object>}
 */
async function getCryptoPrices(coinIds) {
  let data;
  switch (PLATFORM_NAME) {
    case 'coinGecko':
      data = await coinGeckoGetCryptoPrices(coinIds);
      data = formatPricesToBinance(data);
      break;
    case 'binance':
      data = await binanceGetCryptoPrices(coinIds);
      break;
  }
  return data;
}

function formatPricesToBinance(prices) {
  return prices;
}

/**
 * @param {Array} coinIds
 * @returns {Promise<void>}
 */
async function coinGeckoGetCryptoPrices(coinIds) {
  const res = await coinPlatformAxios.get('/simple/price', {
    params: {
      ids: coinIds.join(','),
      vs_currencies: 'usd',
      include_24hr_change: true
    },
  });
  return res.data;
}

/**
 * @param {Array} coinIds
 * @returns {Promise<Object>}
 */
async function binanceGetCryptoPrices(coinIds) {
  const data = {};
  await Promise.all(coinIds.map(async (coinId) => {
    const result = await coinPlatformAxios.get('/v3/ticker/24hr', {
      params: { symbol: coinId },
    });
    const toFloatKeys = [
      'priceChange',
      'priceChangePercent',
      'weightedAvgPrice',
      'prevClosePrice',
      'lastPrice',
      'lastQty',
      'bidPrice',
      'bidQty',
      'askPrice',
      'askQty',
      'openPrice',
      'highPrice',
      'lowPrice',
      'volume',
      'quoteVolume',
    ];
    toFloatKeys.forEach((toFloatKey) => {
      result.data[toFloatKey] = parseFloat(result.data[toFloatKey]);
    });
    data[coinId] = result.data;
  }));
  return data;
}

export { getCryptoPrices };
