import {
  PERSON_READ_REQUEST, PERSON_READ_SUCCESS, PERSON_READ_FAILURE,
  // PERSON_EDIT_REQUEST, PERSON_EDIT_SUCCESS, PERSON_EDIT_FAILURE,
  // PERSON_ADD_REQUEST, PERSON_ADD_SUCCESS, PERSON_ADD_FAILURE,
  PERSON_DELETE_REQUEST, PERSON_DELETE_SUCCESS, PERSON_DELETE_FAILURE,
} from '../constants/person';

export default function (state = {
  isFetching: false,
  person: {},
  errorMessage: '',
}, action) {
  switch (action.type) {
    case PERSON_READ_REQUEST:
      return {
        ...state,
        isFetching: true,
        person: {},
      };
    case PERSON_READ_SUCCESS:
      return {
        ...state,
        isFetching: false,
        person: action.person,
        errorMessage: '',
      };
    case PERSON_READ_FAILURE:
      return {
        ...state,
        isFetching: false,
        person: {},
        errorMessage: action.errorMessage,
      };
    case PERSON_DELETE_REQUEST:
      return {
        ...state,
        person: action.person,
        deleteSuccess: false,
      };
    case PERSON_DELETE_SUCCESS:
      return {
        ...state,
        person: {},
        deleteSuccess: true,
      };
    case PERSON_DELETE_FAILURE:
      return {
        ...state,
        deleteSuccess: false,
        errorMessage: action.errorMessage,
      };
    default:
      return state;
  }
}
