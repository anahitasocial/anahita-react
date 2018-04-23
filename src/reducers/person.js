import { Person as PERSON } from '../constants';

export default function (state = {
  isFetching: false,
  success: false,
  emailIsAvailable: false,
  usernameIsAvailable: false,
  person: {},
  error: '',
}, action) {
  switch (action.type) {
    case PERSON.VALIDATE_USERNAME.REQUEST:
      return {
        ...state,
        isFetching: true,
        usernameIsAvailable: false,
      };
    case PERSON.VALIDATE_EMAIL.REQUEST:
      return {
        ...state,
        isFetching: true,
        emailIsAvailable: false,
      };
    case PERSON.EDIT.REQUEST:
    case PERSON.EDIT_ACCOUNT.REQUEST:
    case PERSON.ADD.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
      };
    case PERSON.VALIDATE_USERNAME.SUCCESS:
      return {
        ...state,
        isFetching: false,
        usernameIsAvailable: true,
      };
    case PERSON.VALIDATE_EMAIL.SUCCESS:
      return {
        ...state,
        isFetching: false,
        emailIsAvailable: true,
      };
    case PERSON.EDIT.SUCCESS:
    case PERSON.EDIT_ACCOUNT.SUCCESS:
    case PERSON.ADD.SUCCESS:
      return {
        ...state,
        isFetching: false,
        success: true,
        person: action.person,
        error: '',
      };
    case PERSON.VALIDATE_USERNAME.FAILURE:
      return {
        ...state,
        isFetching: false,
        usernameIsAvailable: false,
      };
    case PERSON.VALIDATE_EMAIL.FAILURE:
      return {
        ...state,
        isFetching: false,
        emailIsAvailable: false,
      };
    case PERSON.EDIT.FAILURE:
    case PERSON.EDIT_ACCOUNT.FAILURE:
    case PERSON.ADD.FAILURE:
      return {
        ...state,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
