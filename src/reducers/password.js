import { Password as PASSWORD } from '../constants';

const initState = {
  isFetching: false,
  success: false,
  error: '',
};

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case PASSWORD.RESET.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case PASSWORD.RESET.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
      };
    case PASSWORD.RESET.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
};
