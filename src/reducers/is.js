import { Is as IS } from '../constants';

const initState = {
  isEmail: false,
  isUsername: false,
  isFetching: false,
  error: '',
};

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case IS.EMAIL.REQUEST:
    case IS.USERNAME.REQUEST:
      return {
        ...state,
        ...initState,
        isFetching: true,
      };
    case IS.EMAIL.SUCCESS:
      return {
        ...state,
        ...initState,
        isEmail: true,
      };
    case IS.USERNAME.SUCCESS:
      return {
        ...state,
        ...initState,
        isUsername: true,
      };
    case IS.EMAIL.FAILURE:
    case IS.USERNAME.FAILURE:
      return {
        ...state,
        ...initState,
        error: action.error,
      };
    default:
      return state;
  }
};
