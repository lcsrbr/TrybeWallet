// Esse reducer será responsável por tratar as informações da pessoa usuária
import { GET_COINS, WALLET_INFOS, REQUEST_API, GET_COINS_INFOS } from '../actions';

const INITIAL_STATE = {
  isLoading: false,
  obj: '',
  expenses: [],
};

function wallet(state = INITIAL_STATE, action) {
  switch (action.type) {
  case REQUEST_API:
    return {
      ...state,
      isLoading: true,
    };
  case GET_COINS:
    return {
      ...state,
      isLoading: false,
      currencies: action.obj,
    };
  case GET_COINS_INFOS:
    return {
      ...state,
      isLoading: false,
      currenciesInfos: action.obj,
    };
  case WALLET_INFOS:
    return {
      ...state,
      expenses: action.payload.value,
    };
  default:
    return state;
  }
}

export default wallet;
