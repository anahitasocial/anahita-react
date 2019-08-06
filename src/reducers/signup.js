import { Signup as SIGNUP } from '../constants';

const initState = {
  isFetching: false,
  success: false,
  error: '',
};

export default (state = { ...initState }, action) => {
  switch (action.type) {
    case SIGNUP.ADD.REQUEST:
      return {
        ...state,
        ...initState,
        isFetching: true,
      };
    case SIGNUP.ADD.SUCCESS:
      return {
        ...state,
        ...initState,
        success: true,
      };
    case SIGNUP.ADD.FAILURE:
      return {
        ...state,
        ...initState,
        error: action.error,
      };
    default:
      return state;
  }
};
