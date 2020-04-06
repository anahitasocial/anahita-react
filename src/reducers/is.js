import { Is as IS } from '../constants';

const initState = {
  isEmail: false,
  isUsername: false,
  isFetching: false,
  error: '',
};

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case IS.USERNAME.REQUEST:
      return {
        ...state,
        isUsername: false,
        isFetching: true,
      };
    case IS.USERNAME.SUCCESS:
      return {
        ...state,
        isUsername: action.isUsername,
        isFetching: false,
      };
    case IS.USERNAME.FAILURE:
      return {
        ...state,
        isUsername: true,
        isFetching: false,
        error: action.error,
      };
    case IS.EMAIL.REQUEST:
      return {
        ...state,
        isEmail: false,
        isFetching: true,
      };
    case IS.EMAIL.SUCCESS:
      return {
        ...state,
        isEmail: action.isEmail,
        isFetching: false,
      };
    case IS.EMAIL.FAILURE:
      return {
        ...state,
        isEmail: true,
        isFetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};
