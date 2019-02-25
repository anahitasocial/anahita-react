import { Person as PERSON } from '../constants';
import PersonDefault from '../proptypes/PersonDefault';

export default function (state = {
  isFetching: false,
  success: false,
  person: PersonDefault,
  error: '',
}, action) {
  switch (action.type) {
    case PERSON.READ.REQUEST:
      return {
        ...state,
        isFetching: true,
        person: PersonDefault,
        success: false,
        error: '',
      };
    case PERSON.EDIT.REQUEST:
    case PERSON.EDIT_ACCOUNT.REQUEST:
    case PERSON.ADD.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        person: action.person,
        error: '',
      };
    case PERSON.READ.SUCCESS:
      return {
        ...state,
        isFetching: false,
        person: action.person,
        error: '',
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
    case PERSON.READ.FAILURE:
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
