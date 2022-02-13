import axios from 'axios';

const COINGECKO_SERVER = 'https://api.coingecko.com/api/v3';
const coinGeckoAxios = axios.create({
  baseURL: COINGECKO_SERVER,
  timeout: 30000,
});

/**
 * @param {Array} coinIds
 * @returns {Promise<Object>}
 */
async function getCryptoPrices(coinIds) {
  const res = await coinGeckoAxios.get('/simple/price', {
    params: {
      ids: coinIds.join(','),
      vs_currencies: 'usd',
      include_24hr_change: true
    },
  });
  return res.data;
}

export { getCryptoPrices };
