import { Auth as AUTH } from '../constants';

const INIT_STATE = {
  emailAvailable: true,
  usernameAvailable: true,
  isFetching: false,
  isValidating: false,
  success: false,
  error: '',
};

export default (state = { ...INIT_STATE }, action) => {
  switch (action.type) {
    case AUTH.RESET:
      return {
        ...state,
        emailAvailable: true,
        usernameAvailable: true,
        isFetching: false,
        isValidating: false,
        success: false,
        error: '',
      };
    case AUTH.VALIDATE.USERNAME.RESET:
      return {
        ...state,
        usernameAvailable: true,
      };
    case AUTH.VALIDATE.EMAIL.RESET:
      return {
        ...state,
        emailAvailable: true,
      };
    case AUTH.VALIDATE.USERNAME.REQUEST:
    case AUTH.VALIDATE.EMAIL.REQUEST:
      return {
        ...state,
        isValidating: true,
        usernameAvailable: true,
        emailAvailable: true,
      };
    case AUTH.VALIDATE.USERNAME.SUCCESS:
      return {
        ...state,
        isValidating: false,
        usernameAvailable: action.isAvailable,
      };
    case AUTH.VALIDATE.EMAIL.SUCCESS:
      return {
        ...state,
        isValidating: false,
        emailAvailable: action.isAvailable,
      };
    case AUTH.VALIDATE.USERNAME.FAILURE:
      return {
        ...state,
        isValidating: false,
        usernameAvailable: false,
      };
    case AUTH.VALIDATE.EMAIL.FAILURE:
      return {
        ...state,
        isValidating: false,
        emailAvailable: false,
      };
    case AUTH.SIGNUP.REQUEST:
    case AUTH.PASSWORD.RESET.REQUEST:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        success: false,
        error: '',
      };
    case AUTH.SIGNUP.SUCCESS:
    case AUTH.PASSWORD.RESET.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        error: '',
      };
    case AUTH.SIGNUP.FAILURE:
    case AUTH.PASSWORD.RESET.FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
};
