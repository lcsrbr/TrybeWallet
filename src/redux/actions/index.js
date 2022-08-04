// Coloque aqui suas actions
export const USER = 'USER';
export const GET_COINS = 'GET_COINS';
export const GET_COINS_INFOS = 'GET_COINS_INFOS';

export const REQUEST_API = 'REQUEST_API';
export const WALLET_INFOS = 'WALLET_INFOS';

export const loginUser = (value) => ({
  type: USER,
  value,
});

export const getWalletInfos = (value) => ({
  type: WALLET_INFOS,
  payload: {
    value,
  },
});

export const requestAPI = () => ({ type: REQUEST_API });

export const getCoins = (value) => (
  {
    type: GET_COINS,
    obj: value,
  });

export const getCoinsInfos = (value) => (
  {
    type: GET_COINS_INFOS,
    obj: value,
  });

export function fetchAPI() {
  return async (dispatch) => {
    try {
      dispatch(requestAPI());
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const data = await response.json();
      dispatch(getCoinsInfos(data));
      const coinsKeys = Object.keys(data !== undefined && data);
      const rightCoins = coinsKeys.filter((coin) => coin !== 'USDT');
      dispatch(getCoins(rightCoins));
    } catch (error) {
      console.error(error);
    }
  };
}
