import { Person as PERSON } from '../constants';

export default function (state = {
  isFetching: false,
  success: false,
  person: {},
  error: '',
}, action) {
  switch (action.type) {
    case PERSON.EDIT.REQUEST:
    case PERSON.EDIT_ACCOUNT.REQUEST:
    case PERSON.ADD.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        person: action.person,
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
